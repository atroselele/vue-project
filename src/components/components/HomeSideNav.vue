<template>
  <div id="sideNav">
    <!-- <el-radio-group v-model="isCollapse" style=""> -->
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!-- </el-radio-group> -->
    <el-menu
      class="el-menu-vertical-demo"
      :router="true"
      :collapse="isCollapse"
      :unique-opened="true"
      :collapse-transition="true"
    >
      <!-- 一级菜单 -->
      <el-submenu
        :index="oneItem.id.toString()"
        v-for="(oneItem, index) in getMenuListData"
        :key="oneItem.id"
      >
        <!-- 模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="icons[index]"></i>
          <!-- 文本 -->
          <span slot="title">{{ oneItem.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="twoItem.path"
          v-for="twoItem in oneItem.children"
          :key="twoItem.id"
          @click="getSelfPath(twoItem.authName)"
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ twoItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { getMenuList } from "@/api/Users";
import "@/assets/font/iconfont.css";
export default {
  name: "HomeSideNav",
  data() {
    return {
      icons: [
        "iconfont icon-xiazai44",
        "iconfont icon-users",
        "iconfont icon-shikong-kongjianxuanzhong",
        "iconfont icon-shangpinchuangjian",
        "iconfont icon-dingdan",
      ],
      isCollapse: false,
    };
  },
  methods: {
    /* 菜单栏的折叠和展开 */
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;

      this.$emit("isCollapse", this.isCollapse);
    },

    getSelfPath(path) {
      this.$bus.$emit("getWay", path);
    },
  },
  computed: {
    getMenuListData() {
      return this.$store.getters["getMenuListData"];
    },
  },
  mounted() {
    this.getSelfPath;
  },
  created() {
    getMenuList().then((res) => {
      this.$store.dispatch("setMenuListData", res.data);
    });
  },
};
</script>

<style lang="less" scoped src="./style/HomeSideNav.less">
</style>