<template>
  <div>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      :closable="false"
      show-icon
    ></el-alert>
    <!-- 选择商品分类 -->
    <div class="choose">
      <span>选择商品分类：</span>
      <el-cascader
        ref="cascader"
        :options="cateChildTree"
        :props="cateProps"
        @change="handleChange"
        clearable
      ></el-cascader>
    </div>
    <el-tabs v-model="requestParams.attr_sel" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          size="mini"
          :disabled="btnDisabled"
          @click="showDisabled('insert')"
          >添加参数</el-button
        >
        <!-- 动态参数表格 -->
        <el-table :data="paramData.manyData" border stripe>
          <el-table-column type="expand">
            <template v-slot="scope">
              <Tag
                @closeTag="closeTag"
                :row="scope.row"
                @handleInputConfirm="handleInputConfirm"
              ></Tag>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showDisabled('update', scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delParam(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button
          type="primary"
          size="mini"
          :disabled="btnDisabled"
          @click="showDisabled('insert')"
          >添加属性</el-button
        >
        <!-- 静态属性表格 -->
        <el-table :data="paramData.onlyData" border stripe>
          <el-table-column type="expand">
            <template v-slot="scope">
              <Tag
                @closeTag="closeTag"
                :row="scope.row"
                @handleInputConfirm="handleInputConfirm"
              ></Tag>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showDisabled('update', scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delParam(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 参数的对话框 -->
    <el-dialog
      :title="paramServe.title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="40%"
    >
      <el-form
        @submit.native.prevent
        :rules="rules"
        ref="ruleForm"
        :model="requestParams"
        label-width="80px"
      >
        <el-form-item :label="paramServe.label" prop="attr_name">
          <el-input
            v-model="requestParams.attr_name"
            @keyup.enter.native="submitSyn"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitSyn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tag from "./el-components/Tag.vue";
import {
  getCategoriesList,
  getParams,
  addParams,
  editParams,
  removeParam,
} from "@/api/Goods";
export default {
  name: "Params",
  components: {
    Tag,
  },
  data() {
    return {
      cateChildTree: [],
      //指定级联选择器的配置
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      /* 请求参数 */
      requestParams: {
        cat_id: "",
        attr_id: "",
        attr_name: "",
        attr_sel: "many",
        attr_vals: "",
      },
      /* 表单结构 */
      paramServe: {
        title: "",
        label: "",
      },
      btnDisabled: true,
      dialogVisible: false,
      paramData: {
        manyData: [],
        onlyData: [],
      },
      rules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
    };
  },
  methods: {
    /* 删除Tag */
    closeTag(row, index) {
      this.requestParams.attr_id = row.attr_id;
      row.attr_vals.splice(index, 1);
      removeParam(this.requestParams);
      this.clearParamData();
    },
    /* 添加tag */
    handleInputConfirm(row, inputValue) {
      row.attr_vals.push(inputValue);
      editParams(row);
    },
    /* 删除参数 */
    delParam(attr_id) {
      this.requestParams.attr_id = attr_id;
      this.$confirm("确认要删除该参数吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removeParam(this.requestParams).then(() => {
            this.sendParamRequest();
            this.clearParamData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 提交对话框表单 */
    submitSyn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.requestParams.attr_id === "") {
            //如果是空值，就说明是添加业务
            addParams(this.requestParams).then(() => {
              this.sendParamRequest();
              this.clearParamData();
            });
          } else {
            //编辑业务
            editParams(this.requestParams).then(() => {
              this.sendParamRequest();
              this.clearParamData();
            });
          }
          this.handleClose();
        }
      });
    },
    /* 清空数据结构 */
    clearParamData() {
      this.requestParams.attr_id = "";
      this.requestParams.attr_name = "";
    },
    /* 对话框表单业务结构 */
    disabledService(service) {
      if (this.requestParams.attr_sel === "many") {
        this.paramServe.title =
          service === "insert" ? "添加动态参数" : "修改动态参数";
        this.paramServe.label = "动态参数";
      } else if (this.requestParams.attr_sel === "only") {
        this.paramServe.title =
          service === "update" ? "修改静态属性" : "添加静态属性";
        this.paramServe.label = "静态参数";
      }
    },
    showDisabled(service, paramsServe) {
      this.disabledService(service);
      this.dialogVisible = true;
      if (!paramsServe) return;
      this.requestParams.attr_id = paramsServe.attr_id;
      console.log(this.requestParams.attr_id);
      this.requestParams.attr_name = paramsServe.attr_name;
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
    /* tab切换回调 */
    handleClick() {
      if (!this.btnDisabled) {
        this.sendParamRequest();
      }
    },
    /* 级联选中器发生变化回调 */
    handleChange(ids) {
      if (ids.length < 3) {
        //没有选中三级分类
        this.btnDisabled = true;
        this.clear();
      } else {
        //选中三级分类
        this.requestParams.cat_id = ids[ids.length - 1];
        this.btnDisabled = false;
        this.sendParamRequest();
      }
    },
    /* 级联选择器清空按钮的内置绑定事件 */
    clear() {
      for (let k in this.paramData) {
        this.paramData[k] = [];
      }
      this.$refs.cascader.checkedValue = "";
    },
    /* 发送参数列表请求 */
    async sendParamRequest() {
      const { data, meta } = await getParams(this.requestParams);
      if (meta.status == 200) {
        if (this.requestParams.attr_sel === "many") {
          data.forEach((item) => {
            this.mapAttrVals(item);
          });
          this.paramData.manyData = data;
        } else if (this.requestParams.attr_sel === "only") {
          data.forEach((item) => {
            this.mapAttrVals(item);
          });
          this.paramData.onlyData = data;
        }
      }
    },
    /* 转换结构attr_vals */
    mapAttrVals(item) {
      const reg = new RegExp(",| ", "g");
      item.attr_vals = item.attr_vals
        ? item.attr_vals.replace(reg, ",").split(",")
        : [];
    },
    async sendCategoriesRequest() {
      const { data, meta } = await getCategoriesList();
      if (meta.status == 200) {
        this.cateChildTree = data;
      }
    },
  },
  created() {
    this.sendCategoriesRequest();
  },
};
</script>

<style scoped>
.el-table {
  font-size: 12px;
  margin-top: 10px;
}
.choose {
  padding: 15px;
}
</style>