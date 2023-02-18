<template>
  <div>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="userParam.query"
            @keyup.enter.native="findUsersByName"
          >
            <el-button slot="append" icon="el-icon-search" @click="findUsersByName"></el-button>
          </el-input>
        </el-col >
        <el-col :span="4"><el-button type="primary" @click="modalFrame.insertDialogVisible = true">添加用户</el-button></el-col </el-col>
      </el-row>
      <!-- 用户列表 -->
      <div class="userList">
        <el-table :data="getUserList" stripe style="width: 100%" border :header-cell-style="{'text-align':'center'}">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="username" label="姓名" ></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
        </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180px" >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="toUpdateUserInfo(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top" >
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRolesDialogVisible(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 页码条 -->
      <Pagination ref="pagination"></Pagination>
      <!-- 添加管理员模态框 -->
      <el-dialog
          title="添加用户"
          :visible.sync="modalFrame.insertDialogVisible"
          width="40%">
          <el-form :model="ruleForm" :rules="rules" ref="insertUser" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username" >
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" >
              <el-input v-model="ruleForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" >
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile" >
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('insertUser')">取 消</el-button>
            <el-button type="primary" @click="submitForm('insertUser')">确 定</el-button>
          </span>
      </el-dialog>
       <!-- 编辑管理员模态框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="modalFrame.updateDialogVisible"
        width="40%">
        <el-form :model="updateInfoData" :rules="rules" ref="updateUserInfoRuleForm" label-width="100px" class="demo-ruleForm">
          <el-input v-model="updateInfoData.id" type="hidden"></el-input>
          <el-form-item label="用户名" prop="username" >
            <el-input v-model="updateInfoData.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" >
            <el-input v-model="updateInfoData.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile" >
            <el-input v-model="updateInfoData.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('updateUserInfoRuleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('updateUserInfoRuleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色模态框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="modalFrame.updateRolesDialogVisible"
        width="40%" @close="updateRolesParam.rid=''">
        <el-form :model="updateRolesData" :rules="rules" ref="setRolesRuleForm" label-width="100px" class="demo-ruleForm">
          <el-input v-model="updateRolesParam.id" type="hidden"></el-input>
          <el-form-item label="当前用户">
            {{updateRolesData.username}}
          </el-form-item>
          <el-form-item label="当前角色">
            {{updateRolesData.role_name}}
          </el-form-item>
          <el-form-item label="分配新角色">
            <el-select v-model="updateRolesParam.rid" placeholder="请选择">
              <el-option v-for="(item, index) in updateRolesData.region" 
              :key="item.id" 
              :value="item.id"
              :label="item.roleName"
              >{{item.roleName}}</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('setRolesRuleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('setRolesRuleForm')">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  changeState,
  insertUser,
  updateUserInfo,
  deleteUser,
  distrRoles,
} from "@/api/Users";
import Pagination from "./el-components/Pagination";
import { getRolesList } from "@/api/Rights";
export default {
  name: "Users",
  components: {
    Pagination,
  },
  provide() {
    return {
      current_page: this.userParam.pagenum,
      page_size: this.userParam.pagesize,
      total: () => this.$store.getters["getUserList"].total,
    };
  },
  data() {
    return {
      modalFrame: {
        insertDialogVisible: false, //控制新增模态框
        updateDialogVisible: false, //控制修改管理员信息模态框
        updateRolesDialogVisible: false, //控制修改角色模态框
      },
      userParam: { query: "", pagenum: 1, pagesize: 7 },
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      updateInfoData: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      updateRolesData: {
        username: "",
        role_name: "",
        region: "",
      },
      updateRolesParam: {
        id: "",
        rid: "",
      },
      // 新增管理员信息
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 18,
            message: "密码长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern:
              /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码",
          },
        ],
      },
    };
  },
  methods: {
    /* 修改管理员用户状态 */
    changeState(user) {
      changeState({ uId: user.id, type: user.mg_state });
    },
    /* 根据管理员姓名模糊查询 */
    findUsersByName() {
      this.sendUserRequest();
    },
    /* 删除管理员 */
    deleteUser(id) {
      this.$confirm("确认要删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser(id).then(() => {
            this.sendUserRequest();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 修改管理员信息 */
    toUpdateUserInfo(user) {
      this.modalFrame.updateDialogVisible = true;
      for (let k in this.updateInfoData) {
        if (user.hasOwnProperty(k)) {
          this.updateInfoData[k] = user[k];
        }
      }
    },
    /* 分配管理员角色 */
    async showRolesDialogVisible(user) {
      for (let key in this.updateRolesData) {
        if (user.hasOwnProperty(key)) {
          this.updateRolesData[key] = user[key];
        }
      }
      this.updateRolesParam.id = user.id;
      this.updateRolesData.region = this.$store.getters["getRolesList"];
      this.modalFrame.updateRolesDialogVisible = true;
    },

    /* 发送管理员信息数据请求 */
    async sendUserRequest() {
      const usersData = await getUsers(this.userParam);
      if (usersData.meta.status === 200) {
        this.$store.dispatch("saveUsersData", usersData.data);
      }
      const { data, meta } = await getRolesList();
      if (meta.status === 200) {
        this.$store.dispatch("setRolesList", data);
      }
    },
    /* 修改管理员列表 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === "insertUser") {
            this.modalFrame.insertDialogVisible = false;
            insertUser(this.ruleForm).then(() => {
              this.sendUserRequest();
            });
          } else if (formName === "updateUserInfoRuleForm") {
            this.modalFrame.updateDialogVisible = false;
            updateUserInfo(this.updateInfoData).then(() => {
              this.sendUserRequest();
            });
          } else if (formName === "setRolesRuleForm") {
            this.modalFrame.updateRolesDialogVisible = false;
            distrRoles(this.updateRolesParam).then(() => {
              this.sendUserRequest();
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      for (let k in this.modalFrame) {
        this.modalFrame[k] = false;
      }
      this.$refs[formName].resetFields();
    },
  },
  computed: {
    getUserList() {
      return this.$store.getters["getUserList"].users;
    },
  },
  mounted() {
    this.$refs.pagination.$on("sizeChange", (value) => {
      this.userParam.pagesize = value;
      this.sendUserRequest();
    });
    this.$refs.pagination.$on("currentChange", (value) => {
      this.userParam.pagenum = value;
      this.sendUserRequest();
    });
  },
  created() {
    this.sendUserRequest();
  },
};
</script>

<style scoped>
.userList {
  margin: 10px 0;
}
.el-table {
  font-size: 12px;
}
</style>