<template>
  <div id="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ pathName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      pathName: "",
    };
  },
  mounted() {
    this.$bus.$on("getWay", (pathName) => {
      this.pathName = pathName;
    });
  },
};
</script>

<style scoped>
#breadcrumb {
  margin-bottom: 20px;
}
</style>