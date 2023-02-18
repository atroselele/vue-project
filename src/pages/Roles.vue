<template>
  <div>
    <el-button type="primary" @click="modalFrame.insertRoles = true"
      >添加角色</el-button
    >
    <div class="roles">
      <el-table
        :data="getRolesList"
        stripe
        style="width: 100%"
        border
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="明细" type="expand">
          <template v-slot="scope">
            <el-row
              type="flex"
              align="middle"
              justify="center"
              :class="['bottomLine', index1 === 0 ? 'topLine' : '']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5" align="center">
                <el-tag @close="removeRights(scope.row.id, item1.id)" closable
                  >{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  type="flex"
                  align="middle"
                  justify="center"
                  :class="[index2 === 0 ? '' : 'topLine']"
                  v-for="(item2, index2) in item1.children"
                  :key="index2"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRights(scope.row.id, item2.id)"
                      type="success"
                      >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRights(scope.row.id, item3.id)"
                      type="warng"
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" align="center" width="350px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="toChangeRoles(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增角色 -->
    <div class="insertRoles">
      <el-dialog
        title="添加角色"
        :visible.sync="modalFrame.insertRoles"
        width="40%"
      >
        <el-form
          :model="insertRolesForm"
          :rules="changeRules"
          ref="insertRoles"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="insertRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="insertRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('insertRoles')">取 消</el-button>
          <el-button type="primary" @click="submitForm('insertRoles')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="modalFrame.updateRoles"
      width="40%"
    >
      <el-form
        :model="updateRolesForm"
        :rules="changeRules"
        ref="updateRoles"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-input :value="updateRolesForm.id" type="hidden"></el-input>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="updateRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateRoles')">取 消</el-button>
        <el-button type="primary" @click="submitForm('updateRoles')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="modalFrame.showSetRightDialog"
      width="45%"
      @close="clearKeys"
    >
      <!-- 树形结构 -->
      <el-tree
        ref="trees"
        :data="getRightsTree"
        node-key="id"
        show-checkbox
        :props="treeProps"
        :default-expand-all="true"
        :default-checked-keys="defChecked"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalFrame.showSetRightDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="setRight()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  insertRoles,
  updateRoles,
  deleteRoles,
  getRightsData,
  removeRolesRights,
  updateRolesRight,
} from "@/api/Rights";
export default {
  name: "Roles",
  data() {
    return {
      modalFrame: {
        insertRoles: false,
        updateRoles: false,
        showSetRightDialog: false,
      },
      insertRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      updateRolesForm: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      changeRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 树形结构渲染指定属性
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认树形选中的id
      defChecked: [],
      treeParam: {
        id: "",
        checkedAllId: [],
      },
    };
  },
  methods: {
    removeRights(roleId, rightId) {
      this.$confirm("确认要删除该权限吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removeRolesRights({ roleId, rightId }).then(() => {
            this.sendRolesRequest();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 发送角色列表请求 */
    async sendRolesRequest() {
      const rolesList = await getRolesList();
      this.$store.dispatch("setRolesList", rolesList.data);
    },
    /* 发送权限列表请求 */
    async sendRightsRequest() {
      const { data, meta } = await getRightsData("tree");
      if (meta.status === 200) {
        this.$store.dispatch("saveRightsTree", data);
      }
    },
    /* 编辑角色 */
    toChangeRoles(roles) {
      this.modalFrame.updateRoles = true;
      for (let k in this.updateRolesForm) {
        if (this.updateRolesForm.hasOwnProperty(k)) {
          this.updateRolesForm[k] = roles[k];
        }
      }
    },
    /* 删除角色名 */
    deleteRoles(id) {
      this.$confirm("确认要删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRoles(id).then(() => {
            this.sendRolesRequest();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 显示分配角色权限对话框 */
    showSetRightDialog(roles) {
      this.treeParam.id = roles.id;
      this.getChildrenID(roles.children);
      this.modalFrame.showSetRightDialog = true;
    },
    /* 获取三级权限id */
    getChildrenID(node) {
      node.forEach((item) => {
        if (!item.children) {
          this.defChecked.push(item.id);
        } else {
          this.getChildrenID(item.children);
        }
      });
    },
    clearKeys() {
      this.$nextTick(() => {
        this.$refs.trees.setCheckedKeys([]);
      });
      this.defChecked = [];
    },
    /* 分配权限 */
    setRight() {
      this.modalFrame.showSetRightDialog = false;
      //获取所有选中以及半选中的子节点的id
      this.treeParam.checkedAllId = [
        ...this.$refs.trees.getCheckedKeys(),
        ...this.$refs.trees.getHalfCheckedKeys(),
      ];
      updateRolesRight(this.treeParam).then(() => {
        this.sendRolesRequest();
      });
    },
    /* 角色名操作 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === "insertRoles") {
            insertRoles(this.insertRolesForm).then(() => {
              this.modalFrame.insertRoles = false;
              this.sendRolesRequest();
            });
          } else if (formName === "updateRoles") {
            updateRoles(this.updateRolesForm).then(() => {
              this.modalFrame.updateRoles = false;
              this.sendRolesRequest();
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
    getRolesList() {
      return this.$store.getters["getRolesList"];
    },
    getRightsTree() {
      return this.$store.getters["getRightsTree"];
    },
  },
  created() {
    this.sendRolesRequest();
    this.sendRightsRequest();
  },
};
</script>

<style scoped>
.el-table {
  margin: 15px 0;
  font-size: 12px;
}
.el-tag {
  margin: 7px;
}

.topLine {
  border-top: 1px solid #ebeef5;
}
.bottomLine {
  border-bottom: 1px solid #ebeef5;
}
</style>