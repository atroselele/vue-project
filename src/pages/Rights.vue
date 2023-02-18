<template>
  <div class="rightsList">
    <el-table
      :data="getRightsList"
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
      <el-table-column prop="authName" label="权限名称"  align="center"></el-table-column>
      <el-table-column prop="path" label="路径"  align="center"></el-table-column>
      <el-table-column prop="level" label="权限等级"  align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRightsData } from "@/api/Rights";

export default {
  name: "Rights",
  methods: {
    async sendRightsRequest() {
      const rightsList = await getRightsData("list");
      this.$store.dispatch("setRightsList", rightsList.data);
    },
  },
  computed: {
    getRightsList() {
      return this.$store.getters["getRightsList"];
    },
  },
  created() {
    /* 获取权限数据列表 */
    this.sendRightsRequest();
  },
};
</script>

<style scoped>
.el-table {
  font-size: 12px;
}
.el-tag {
  user-select: none;
}
</style>
