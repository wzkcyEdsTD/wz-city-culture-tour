/*
 * @Author: eds
 * @Date: 2020-08-11 20:39:55
 * @LastEditTime: 2020-08-14 16:35:16
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\store\index.js
 */
// 入口文件
import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import * as getters from "./getters";
import state from "./state";
import mutations from "./mutations";
import createLogger from "vuex/dist/logger";
import login from "./modules/login";
import map from "./modules/map";
import traffic from "./modules/traffic";
import stateM from "./modules/stateM/index";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  modules: {
    login,
    map,
    traffic,
    stateM
  }
});
