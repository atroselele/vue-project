<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current_page"
      :page-sizes="[3, 7, 9, 15]"
      :page-size="page_size"
      :total="total()"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
import { Pagination } from "@/mixin";
export default {
  name: "Pagination",
  inject: ["current_page", "page_size", "total"],
  mixins: [Pagination],
};
</script>

<style>
</style>