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
    {
      path: "/map", // 文旅
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
    },
    {
      path: "/trafficlayer", // 交通
      name: "trafficlayer",
      meta: {
        title: "城市大脑·交通图层"
      },
      component: resolve => require(["page/trafficlayer/trafficlayer"], resolve)
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
