<template>
  <div>
    <el-input
      placeholder="请输入订单编号"
      v-model="ordersParam.query"
      class="input-with-select"
      @keydown.enter.native="findOrdersById"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="findOrdersById"
      ></el-button>
    </el-input>
    <div class="orders">
      <el-table
        :data="getOrdersList"
        stripe
        style="width: 100%"
        border
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="明细" align="center" type="expand">
          <template slot-scope="scope">
            <pre>
              {{ scope.row }}
            </pre>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="150px"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格(元)"
          align="center"
        ></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" align="center">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              v-if="scope.row.pay_status == 0"
              type="success"
              effect="dark"
            >
              未付款
            </el-tag>
            <el-tag
              size="mini"
              v-else
              type="danger"
              effect="dark"
              v-else-if="scope.row.pay_status == 1"
            >
              已付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
          width="200px"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.update_time | timeFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改收货地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showHarvest(scope.row.order_id)"
              ></el-button
            ></el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="查看物流信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-location-outline"
                size="mini"
                @click="showLogisticInfo(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 页码条 -->
    <Pagination ref="pagination"></Pagination>
    <!-- 物流信息 -->
    <el-dialog
      @close="logisticInfo = []"
      title="物流进度"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logisticInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!-- 修改收获地址 -->
    <el-dialog
      title="修改收获地址"
      :visible.sync="harvestVisible"
      width="40%"
      @close="closeHarvestVisible"
    >
      <el-form
        :model="harvestParam"
        :rules="harvestRules"
        label-width="100px"
        ref="editHarvest"
      >
        <el-form-item label="省市区/县" prop="consignee_addr">
          <el-cascader
            ref="cascader"
            :options="options"
            :props="cateProps"
            @change="handleChange"
            v-model="harvestParam.consignee_addr"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="harvest">
          <el-input v-model="harvestParam.harvest"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="harvestVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editHarvest')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getLogisticInfo, editHarvest } from "@/api/Orders";
import mkfsTime from "@/utils/mkfsTime";
import Pagination from "./el-components/Pagination";
import { regionData } from "element-china-area-data";
import deepCopy from "@/utils/deepCopy";

export default {
  name: "Orders",
  components: {
    Pagination,
  },
  provide() {
    return {
      current_page: this.ordersParam.pagenum,
      page_size: this.ordersParam.pagesize,
      total: () => this.$store.getters["getOrdersData"].total,
    };
  },
  data() {
    return {
      dialogVisible: false,
      harvestVisible: false,
      ordersParam: {
        query: "",
        pagenum: 1,
        pagesize: 7,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: "",
      },
      options: regionData,
      cateProps: {
        value: "label",
        label: "label",
        expandTrigger: "hover",
      },
      /* 修改地址请求参数 */
      harvestParam: {
        order_id: "",
        harvest: "",
        consignee_addr: "",
      },
      logisticInfo: [],
      harvestRules: {
        harvest: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        consignee_addr: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /* 级联选择器清空按钮的内置绑定事件 */
    clear() {
      this.$refs.cascader.checkedValue = "";
    },
    /* harvestVisible 关闭的回调 */
    closeHarvestVisible() {
      for (let k in this.harvestParam) {
        this.harvestParam[k] = "";
      }
      this.clear();
    },
    handleChange(val) {
      this.consignee_addr = val;
    },
    /* 显示收货地址 */
    showHarvest(id) {
      this.harvestParam.order_id = id;
      this.harvestVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const harvestParam = deepCopy(this.harvestParam);
          harvestParam.consignee_addr.push(this.harvestParam.harvest);
          harvestParam.consignee_addr = harvestParam.consignee_addr.join(",");
          // editHarvest(harvestParam).then(() => {
          //   this.sendOrderRequest();
          // });
          this.$message({
            message: "更新地址成功",
            type: "success",
          });
          this.harvestVisible = false;
        }
      });
    },

    /* 显示物流信息 */
    showLogisticInfo(row) {
      getLogisticInfo(row.order_id).then(({ data, meta }) => {
        if (meta.status === 200) {
          console.log(data);
          this.logisticInfo = data;
          this.dialogVisible = true;
        }
      });
    },
    /* 根据订单编号查询 */
    findOrdersById() {
      this.sendOrderRequest();
    },
    async sendOrderRequest() {
      const { data, meta } = await getOrderList(this.ordersParam);
      if (meta.status === 200) {
        console.log(data);
        this.$store.dispatch("saveOrdersData", data);
      }
    },
  },
  filters: {
    timeFormate(time) {
      return mkfsTime(time * 1000);
    },
  },
  computed: {
    getOrdersList() {
      return this.$store.getters["getOrdersData"].goods;
    },
  },
  mounted() {
    this.$refs.pagination.$on("sizeChange", (value) => {
      this.ordersParam.pagesize = value;
      this.sendOrderRequest();
    });
    this.$refs.pagination.$on("currentChange", (value) => {
      this.ordersParam.pagenum = value;
      this.sendOrderRequest();
    });
  },
  created() {
    this.sendOrderRequest();
  },
};
</script>

<style scoped>
.el-table {
  margin: 10px 0;
  font-size: 12px;
}
.input-with-select {
  width: 30%;
}
</style>