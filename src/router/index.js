/*
 * @Author: eds
 * @Date: 2020-07-01 14:19:49
 * @LastEditTime: 2020-07-21 09:04:17
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\router\index.js
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "hash",
  routes: [{
      path: "/",
      redirect: "Map"
    },
    // {
    //   path: "/state",
    //   name: "state",
    //   component: resolve => require(["page/state/state"], resolve) // 404页面
    // },
    {
      path: "/map", // 风险一张图
      name: "Map",
      meta: {
        title: "城市大脑·文化旅游"
      },
      component: resolve => require(["page/map/map"], resolve)
    },
    {
      path: "/medical", // 医疗
      name: "Medical",
      meta: {
        title: "城市大脑·医疗生活"
      },
      component: resolve => require(["page/medical/medical"], resolve)
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
})

export default router;
