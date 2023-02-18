<template>
  <div>
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    >
    </el-alert>
    <div class="content">
      <div class="steps">
        <el-steps
          :space="200"
          :active="Number(activeIndex)"
          align-center
          finish-status="success"
        >
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <div class="tab">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          label-position="top"
        >
          <el-tabs
            :before-leave="beforeTab"
            v-model="activeIndex"
            tab-position="left"
            @tab-click="tabClick"
          >
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="ruleForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input
                  type="number"
                  v-model="ruleForm.goods_price"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input
                  v-model="ruleForm.goods_weight"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input
                  v-model="ruleForm.goods_number"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  ref="cascader"
                  :options="categoriesData"
                  :props="cateProps"
                  @change="handleChange"
                  clearable
                  :value="goods_cat"
                ></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item
                :label="item.attr_name"
                v-for="(item, index) in manyData"
                :key="item.attr_id"
              >
                <keep-alive>
                  <!-- BUG没有选中的值，直接消失，不利于选择 -->
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox
                      border
                      :label="val"
                      v-for="(val, i) in item.attr_vals"
                      :key="i"
                    ></el-checkbox>
                  </el-checkbox-group>
                </keep-alive>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item
                :label="item.attr_name"
                v-for="(item, index) in onlyData"
                :key="item.attr_id"
              >
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload
                :headers="headers"
                :action="`${baseURL}/upload`"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :file-list="ruleForm.fileList"
                :on-success="handleResponse"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 副文本编辑器 -->
              <quill-editor v-model="ruleForm.goods_introduce"> </quill-editor>
              <el-button @click="editGoods" class="addBtn" type="primary">{{
                isService
              }}</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCategoriesList,
  getParams,
  addGoods,
  findGoodsById,
  updateGoods,
} from "@/api/Goods";
import { getToken } from "@/utils/cookieHandle";
import deepCopy from "@/utils/deepCopy";
export default {
  name: "GoodsService",
  data() {
    return {
      activeIndex: 0,
      //级联选择器要渲染的数据
      categoriesData: [],
      ruleForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
        fileList: [],
      },
      manyData: [],
      onlyData: [],
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      //指定级联选择器的配置
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //图片上传组件的headers请求头对象
      headers: {
        Authorization: getToken(),
      },
    };
  },
  computed: {
    catId() {
      if (this.ruleForm.goods_cat.length) {
        return Number(this.ruleForm.goods_cat[2]);
      }
    },
    /* 获取接口根路径 */
    baseURL() {
      return process.env.VUE_APP_BASEURL;
    },
    isService() {
      if (this.isGoodsService()) {
        return "修改商品";
      }
      return "添加商品";
    },
    pics() {
      return this.ruleForm.pics;
    },
    goods_cat: {
      get() {
        if (!Array.isArray(this.ruleForm.goods_cat)) {
          this.ruleForm.goods_cat = this.ruleForm.goods_cat.split(",");
          return this.ruleForm.goods_cat.map((item) => {
            return Number(item);
          });
        }
        return this.ruleForm.goods_cat;
      },
    },
  },
  watch: {
    pics(value) {
      const fileList = value.map((item) => {
        const url = item.pics_big;
        if (url) {
          const arr = url.split("/");
          return {
            name: arr[arr.length - 1],
            url,
          };
        }
      });
      fileList[0] && (this.ruleForm.fileList = fileList);
    },
  },
  methods: {
    /* 判断业务 */
    isGoodsService() {
      return this.$route.query.id;
    },
    editGoods() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.manyData.forEach((item) => {
            this.callBack(item);
          });
          this.onlyData.forEach((item) => {
            this.callBack(item);
          });
          const newData = deepCopy(this.ruleForm);
          newData.goods_cat = newData.goods_cat.toString();
          if (!this.isGoodsService()) {
            addGoods(newData).then(() => {
              this.$router.push("/goods");
            });
          } else {
            updateGoods({
              id: this.$route.query.id,
              params: this.ruleForm,
            }).then(() => {
              this.$router.push("/goods");
            });
          }
        } else {
          this.$message.error("请填写必要的表单项");
        }
      });
    },
    callBack(item) {
      console.log(item);
      this.ruleForm.attrs.push({
        attr_id: item.attr_id,
        attr_value: item.attr_vals.toString(),
      });
    },
    /* tab切换之前的回调 */
    beforeTab(activeName, oldActiveName) {
      if (oldActiveName === "0" && !this.ruleForm.goods_cat.length) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    /* tab点击事件 */
    tabClick(elTab) {
      this.$nextTick(() => {
        if (elTab.loaded) {
          this.tabByIndexRequest(elTab);
        }
      });
    },
    /* 根据tab栏选择发送请求 */
    tabByIndexRequest(elTab) {
      switch (elTab.index) {
        case "1": //商品参数
          getParams({ cat_id: this.catId, attr_sel: "many" }).then((res) => {
            res.data.forEach((item) => {
              this.mapAttrVals(item);
            });
            this.manyData = res.data;
          });
          break;
        case "2": //商品属性
          getParams({ cat_id: this.catId, attr_sel: "only" }).then((res) => {
            this.onlyData = res.data;
          });
          break;
      }
    },
    /* HACK处理图片预览效果 */
    handlePreview(file) {
      console.log(file);
    },
    /* 处理移除图片 */
    handleRemove({ response: { data } }) {
      this.ruleForm.pics = this.ruleForm.pics.filter(
        (item) => item.pic !== data.tmp_path
      );
    },
    /* 图片上传成功执行的回调 */
    handleResponse(file) {
      this.ruleForm.pics.push({ pic: file.data.tmp_path });
      console.log(this.ruleForm.pics);
    },
    /* 转换结构attr_vals */
    mapAttrVals(item) {
      const reg = new RegExp(",| ", "g");
      item.attr_vals = item.attr_vals
        ? item.attr_vals.replace(reg, ",").split(",")
        : [];
    },
    /* 级联选中器发生变化回调 */
    handleChange(ids) {
      if (ids.length < 3) {
        //没有选中三级分类
        this.clear();
      } else {
        //选中三级分类
        this.ruleForm.goods_cat = ids;
        console.log(ids);
      }
    },
    /* 级联选择器清空按钮的内置绑定事件 */
    clear() {
      this.$refs.cascader.checkedValue = "";
    },
    async sendParamsRequest() {
      const { data, meta } = await getCategoriesList();
      if (meta.status == 200) {
        this.categoriesData = data;
      }
    },
    /* 根据id查询商品 */
    async sendGoodsByIdRequest(id) {
      const { data, meta } = await findGoodsById(id);
      if (meta.status == 200) {
        for (let key in this.ruleForm) {
          if (this.ruleForm.hasOwnProperty(key)) {
            this.ruleForm[key] = data[key];
          }
        }
        console.log(data);
      }
    },
  },
  created() {
    if (this.isGoodsService()) {
      this.sendGoodsByIdRequest(this.$route.query.id);
    }
    this.sendParamsRequest();
  },
  deactivated() {
    this.$destroy();
  },
};
</script>

<style scoped>
.content {
  padding: 0 10px;
}
.steps {
  margin: 10px;
}

.el-checkbox {
  margin-right: 5px !important;
}
.addBtn {
  margin-top: 10px;
}
</style>