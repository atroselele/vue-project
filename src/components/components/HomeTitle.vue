<template>
  <div id="content">
    <div class="title">
      <div class="logo">
        <img :src="logo" alt="" />
      </div>
      <h2>电商后台管理系统</h2>
    </div>
    <span class="e-button"
      ><span class="user-tit">欢迎您：{{ getUserName }}</span
      ><el-button size="mini" type="danger" @click="quit">退出</el-button></span
    >
  </div>
</template>

<script>
import logo from "@/assets/logo.png";
import { getUserInfo, removeToken } from "@/utils/cookieHandle";

export default {
  data() {
    return {
      logo,
    };
  },
  computed: {
    getUserName() {
      return getUserInfo();
    },
  },
  methods: {
    quit() {
      this.$message({
        showClose: true,
        message: "退出成功",
        duration: 3000,
      });
      removeToken();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang="less" src="./style/HomeTitle.less"></style>