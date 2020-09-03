/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:04
 * @LastEditTime: 2020-09-03 11:44:02
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\main.js
 */
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import "./font/Digital-7Mono.css";
import "./font/YouSheBiaoTiHei.css";
import "./font/PingFang.css";
import "./font/DIN.css";
import * as filters from "./filters"; // 全局过滤器
import ElementUI from "element-ui";
import VueBus from "vue-bus";

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.use(VueBus);
Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});

window.addEventListener("message", e => console.log(e), false);
