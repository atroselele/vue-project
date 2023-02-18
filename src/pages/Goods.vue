<template>
  <div>
    <!-- 搜索框 -->
    <el-row :gutter="20">
      <el-col :span="9">
        <el-input
          placeholder="请输入商品名称"
          class="input-with-select"
          v-model="goodsParma.query"
          @keyup.enter.native="findGoodsByName"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="findGoodsByName"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4"
        ><el-button type="primary">
          <router-link to="/goods/add" class="titLink">添加商品</router-link>
        </el-button>
      </el-col>
    </el-row>
    <!-- 商品列表 -->
    <div class="goodsList">
      <el-table
        :data="getGoodsData"
        stripe
        style="width: 100%"
        border
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="500px"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          align="center"
        ></el-table-column>
        <el-table-column prop="" label="创建时间" align="center" width="350px">
          <template v-slot="scope">
            {{ scope.row.upd_time | timeFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="toEdit(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGood(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 页码条 -->
    <Pagination ref="pagination"></Pagination>
  </div>
</template>

<script>
import { getGoods, deleteGood } from "@/api/Goods";
import mkfsTime from "@/utils/mkfsTime";
import Pagination from "./el-components/Pagination";
export default {
  name: "Goods",
  components: {
    Pagination,
  },
  provide() {
    return {
      current_page: this.goodsParma.pagenum,
      page_size: this.goodsParma.pagesize,
      total: () => this.$store.getters["getGoodsData"].total,
    };
  },
  data() {
    return {
      goodsParma: { query: "", pagenum: 1, pagesize: 7 },
    };
  },
  computed: {
    getGoodsData() {
      return this.$store.getters["getGoodsData"].goods;
    },
  },
  methods: {
    /* 跳转修改页面 */
    toEdit(id) {
      this.$router.push({
        path: "/goods/edit",
        query: {
          id,
        },
      });
    },
    /* 模糊查询 */
    findGoodsByName() {
      this.sendGoodsRequest();
    },
    /* 删除商品 */
    delGood(id) {
      this.$confirm("确认要删除该商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGood(id).then(() => {
            this.sendGoodsRequest();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 发送商品列表请求 */
    async sendGoodsRequest() {
      const { data, meta } = await getGoods(this.goodsParma);
      if (meta.status == 200) {
        console.log(data);
        this.$store.dispatch("saveGoodsData", data);
      }
    },
  },
  filters: {
    timeFormate(time) {
      return mkfsTime(time * 1000);
    },
  },
  mounted() {
    this.$refs.pagination.$on("sizeChange", (value) => {
      this.goodsParma.pagesize = value;
      this.sendGoodsRequest();
    });
    this.$refs.pagination.$on("currentChange", (value) => {
      this.goodsParma.pagenum = value;
      this.sendGoodsRequest();
    });
  },
  created() {
    this.sendGoodsRequest();
  },
};
</script>

<style scoped>
.goodsList {
  margin: 10px 0;
}
.el-table {
  font-size: 12px;
}
.titLink {
  color: #fff;
}
</style>