<template>
  <div id="Home">
    <el-container>
      <el-header height="60px">
        <HomeTitle></HomeTitle>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <HomeSideNav ref="sideNav"></HomeSideNav>
        </el-aside>
        <el-main>
          <HomeBanner></HomeBanner>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HomeTitle from "./components/HomeTitle.vue";
import HomeBanner from "./components/HomeBanner.vue";
import HomeSideNav from "./components/HomeSideNav.vue";

export default {
  components: {
    HomeTitle,
    HomeBanner,
    HomeSideNav,
  },
  data() {
    return {
      asideWidth: "200px",
    };
  },
  methods: {
    isCollapse(param) {
      this.asideWidth = param ? "max-content" : "200px";
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.sideNav.$on("isCollapse", this.isCollapse);
    });
  },
  beforeDestroy() {
    this.$refs.sideNav.$off("isCollapse");
  },
};
</script>

<style scoped>
#Home {
  height: 100%;
}
.el-header {
  background: rgb(127, 153, 190);
  background: linear-gradient(
    180deg,
    rgba(127, 153, 190, 1) 0%,
    rgba(53, 82, 126, 1) 50%,
    rgba(127, 153, 190, 1) 100%
  );
  color: #333;
}

.el-aside {
  color: #333;
}

.el-main {
  background-color: #eaedf1;
  color: #333;
}

body .el-container {
  height: 100%;
}
</style>