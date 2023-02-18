import Vue from "vue"
import VueRouter from 'vue-router'
import { getToken } from '@/utils/cookieHandle'
import Users from "@/pages/Users";
import Roles from "@/pages/Roles";
import Rights from "@/pages/Rights";
import Goods from "@/pages/Goods";
import Params from "@/pages/Params";
import Categories from "@/pages/Categories";
import Orders from "@/pages/Orders";
import Welcome from '@/pages/Welcome'
import GoodsService from '@/pages/GoodsService'

Vue.use(VueRouter)
/*访问白名单*/
// const whiteList = ["/login"];

/* 路由表 */
const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      component: () => import("@/components/Login"),
      meta: { isAuth: true, title: "登录" }
    },
    {
      path: "/home",
      component: () => import("@/components/Home"),
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome,
          meta: { title: "主页面" }
        },
        {
          path: "/users",
          component: Users,
          meta: { title: "管理员列表" }
        },
        {
          path: "/roles",
          component: Roles,
          meta: { title: "角色列表" }
        },
        {
          path: "/rights",
          component: Rights,
          meta: { title: "权限列表" }
        },
        {
          path: "/goods",
          component: Goods,
          meta: { title: "商品管理" }
        },
        {
          path: "/goods/add",
          component: GoodsService,
          meta: { title: "添加商品" }
        },
        {
          path: "/goods/edit",
          component: GoodsService,
          meta: { title: "编辑商品" }
        },
        {
          path: "/params",
          component: Params,
          meta: { title: "商品分类" }
        },
        {
          path: "/categories",
          component: Categories,
          meta: { title: "商品分类" }
        },
        {
          path: "/orders",
          component: Orders,
          meta: { title: "订单管理" }
        },
      ]
    },
  ], //路由表
  mode: "history"
})

/*挂载路由导航*/
router.beforeEach((to, from, next) => {
  //判断是否需要权限验证
  if (to.meta.isAuth) return next()
  /* 获取token */
  //没有在cookie中获取token,就重定向到login
  if (!getToken()) return next("/login")
  next()
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})


export default router