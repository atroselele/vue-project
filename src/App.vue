<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {
    setCookie
  } from "@/utils/cookieHandle";
  import Home from "@/components/Home";
  export default {
    name: "App",
    components: {
      Home
    },
    beforeDestroy() {
      setCookie("SelfPath", "welcome");
    },
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  body {
    width: 100vw;
    height: 100vh;
    font-size: 16px;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  a {
    text-decoration: none;
  }

  .el-step__title {
    font-size: 10px;
  }

  .ql-editor {
    min-height: 300px;
  }
</style>
