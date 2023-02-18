<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <el-card class="box-card">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "./Breadcrumb.vue";
export default {
  components: {
    Breadcrumb,
  },
};
</script>

<style>
.el-card {
  box-shadow: 0 1px 2px #cbcdd1 !important;
}
.box-card {
  width: 100%;
}
</style>