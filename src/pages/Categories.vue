<template>
  <div>
    <el-button type="primary" @click.native="showInsertCate"
      >添加分类</el-button
    >
    <div class="categories">
      <!-- selection-type:是否为多选类型表格
          expand-type:是否为展开行类型表格
          show-index:是否显示索引
          columns:定义每一列的参数
          border:是否显示纵向分割线
       -->
      <tree-table
        :data="getCategoriesList"
        :selection-type="false"
        :expand-type="false"
        :columns="columns"
        show-index
        border
        stripe
      >
        <!-- 是否有效模板插槽 -->
        <template #isActive="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序模板插槽 -->
        <template #order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == 1"
          >
            二级
          </el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template #operation="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateCate(scope.row.cat_id)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
          >
            删除
          </el-button>
        </template>
      </tree-table>
    </div>
    <!-- 页码条 -->
    <Pagination ref="pagination"></Pagination>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="modalFrame.insertCate"
      width="40%"
      @close="resetForm('insertCate')"
    >
      <el-form
        :model="insertCateParam"
        :rules="changeRules"
        ref="insertCate"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="insertCateParam.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            clearable
            :options="cateChildTree"
            :props="cateProps"
            @change="cateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('insertCate')">取 消</el-button>
        <el-button type="primary" @click="submitForm('insertCate')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑分类名称 -->
    <el-dialog
      title="修改分类"
      :visible.sync="modalFrame.updateCate"
      width="40%"
      @close="resetForm('updateCate')"
    >
      <el-form
        :model="updateCateParam"
        :rules="changeRules"
        ref="updateCate"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="updateCateParam.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateCate')">取 消</el-button>
        <el-button type="primary" @click="submitForm('updateCate')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoriesList,
  insertGoodsCate,
  editGoodsCateName,
  deleteCate,
} from "@/api/Goods";
import Pagination from "./el-components/Pagination";
export default {
  name: "Categories",
  components: {
    Pagination,
  },
  provide() {
    return {
      current_page: this.requestParam.pagenum,
      page_size: this.requestParam.pagesize,
      total: () => this.$store.getters["getCategoriesData"].total,
    };
  },
  data() {
    return {
      //为 table 指定列的定义
      modalFrame: { insertCate: false, updateCate: false },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "是否有效",
          //当前页定义为模板列
          type: "template",
          //模板名称
          template: "isActive",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
          align: "center",
          headerAlign: "center",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
          align: "center",
          headerAlign: "center",
        },
      ],
      requestParam: {
        type: "",
        pagenum: 1,
        pagesize: 7,
      },
      //添加分类的请求参数
      insertCateParam: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      changeRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      cateChildTree: [],
      //指定级联选择器的配置
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      //修改分类名称参数
      updateCateParam: {
        cat_id: "",
        cat_name: "",
      },
    };
  },
  methods: {
    /* 发送商品分类请求 */
    async sendCategoriesRequest() {
      const { data, meta } = await getCategoriesList(this.requestParam);
      if (meta.status == 200) {
        this.$store.dispatch("saveCategoriesData", data);
      }
    },
    /* 显示添加分类 */
    showInsertCate() {
      this.sendCateChildRequest();
      this.modalFrame.insertCate = true;
    },
    /* 发送父级子类分类请求 */
    async sendCateChildRequest() {
      const { data, meta } = await getCategoriesList({ type: 2 });
      if (meta.status == 200) {
        this.cateChildTree = data;
      }
    },
    /* 级联选中器发生变化回调 */
    cateChange(ids) {
      this.insertCateParam.cat_pid = ids[ids.length - 1];
      this.insertCateParam.cat_level = ids.length;
    },
    /* 显示修改分类名称对话框 */
    showUpdateCate(id) {
      this.modalFrame.updateCate = true;
      this.updateCateParam.cat_id = id;
    },
    /* 删除商品分类 */
    deleteCate(id) {
      this.$confirm("确认要删除该分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCate(id).then(() => {
            this.sendCategoriesRequest();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === "insertCate") {
            this.modalFrame.insertCate = false;
            insertGoodsCate(this.insertCateParam).then(() => {
              this.sendCategoriesRequest();
            });
          } else if (formName === "updateCate") {
            this.modalFrame.updateCate = false;
            editGoodsCateName(this.updateCateParam).then(() => {
              this.sendCategoriesRequest();
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
    getCategoriesList() {
      return this.$store.getters["getCategoriesData"].result;
    },
  },
  mounted() {
    this.$refs.pagination.$on("sizeChange", (value) => {
      this.requestParam.pagesize = value;
      this.sendCategoriesRequest();
    });
    this.$refs.pagination.$on("currentChange", (value) => {
      this.requestParam.pagenum = value;
      this.sendCategoriesRequest();
    });
  },
  created() {
    this.sendCategoriesRequest();
  },
};
</script>

<style scoped>
.categories {
  margin: 10px 0;
  font-size: 12px;
}
.el-icon-success {
  color: #90ee90;
}
.el-icon-error {
  color: #f56c6c;
}
.el-cascader {
  width: 100%;
}
</style>