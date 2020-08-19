/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:04
 * @LastEditTime: 2020-08-13 17:06:13
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\main.js
 */
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
// import './router/permission.js'
import "./font/Digital-7Mono.css";
import "./font/YouSheBiaoTiHei.css";
import "./font/PingFang.css";
import * as filters from "./filters"; // 全局过滤器
import ElementUI from "element-ui";
// import echarts from 'echarts'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueBus from "vue-bus";

// import 'jquery'/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') {
// require('../mock')
// }

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.use(VueBus);
// Vue.use(VueAwesomeSwiper)
Vue.use(ElementUI);
// Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
