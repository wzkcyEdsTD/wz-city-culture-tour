/*
 * @Author: eds
 * @Date: 2020-07-01 14:19:49
 * @LastEditTime: 2020-09-15 11:14:22
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\router\index.js
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      redirect: "sourcelayer"
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
      path: "/sourcelayer", // 医疗
      name: "sourcelayer",
      meta: {
        title: "城市大脑·资源图层"
      },
      component: resolve => require(["page/sourcelayer/sourcelayer"], resolve)
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
