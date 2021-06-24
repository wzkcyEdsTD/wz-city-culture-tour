/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:04
 * @LastEditTime: 2020-09-03 19:47:41
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\main.js
 */
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import VueBus from "vue-bus";
import VueAwesomeSwiper from 'vue-awesome-swiper'
import { initPlugin, SingleVideoCall } from "common/js/ws/wsplugin";

//  地图材质
import "./material/PolylineTrailLink";

//  第三方样式库
import "element-ui/lib/theme-chalk/index.css";
import 'swiper/css/swiper.css'

//  第三方库
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)
Vue.use(VueBus);
Vue.use(ElementUI);
Vue.config.productionTip = false;

//  ws
initPlugin();

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
