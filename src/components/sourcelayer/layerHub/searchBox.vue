<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-09-15 11:07:30
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\treeTool\searchBox.vue
-->
<template>
  <div class="search-box" v-show="searchBoxVisible">
    <div class="header">
      <p class="title">资源选择</p>
      <img
        class="menu"
        :src="searchBoxResult ? menuSelImg : menuImg"
        width="59px"
        @click="toogleVisible"
      />
    </div>
    <div class="searchHeader">
      <el-input
        v-model="searchText"
        class="searchFilterInput"
        :placeholder="`附近的${forceTrueTopicLabelId}有哪些？`"
        size="small"
        @keyup.enter.native="searchFilter"
      />
      <div class="button-container">
        <div class="button-item">
          <i class="icon-common icon-clear" @click="searchClear"></i>
        </div>
        <div class="button-item">
          <i class="icon-common icon-search" @click="searchFilter"></i>
        </div>
      </div>
    </div>
    <div class="result-wrapper" v-show="searchBoxResult">
      <ul class="result-list">
        <li
          class="result-item"
          :class="{
            checked: ~hospitalChecked.indexOf(item.name),
          }"
          v-for="(item, i) in extraSearchList"
          :key="`sitem-${i}`"
        >
          <div class="left">
            <div class="address">
              <i class="icon-position"></i>
              <p class="name">
                {{ item.name }}
              </p>
            </div>
          </div>
          <div class="right">
            <input
              type="checkbox"
              :checked="hospitalChecked.indexOf(item.name) >= 0"
              @click="checkedOne(item)"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { treeDrawTool, fixTreeWithExtra } from "./TreeDrawTool";
import { getIserverFields } from "api/iServerAPI";
import {
  CESIUM_TREE_OPTION,
  CESIUM_TREE_EXTRA_DATA,
} from "config/server/sourceTreeOption";
const Cesium = window.Cesium;

export default {
  name: "searchBox",
  data() {
    return {
      searchBoxVisible: false,
      searchBoxResult: true,
      searchText: "",
      forceNode: {},
      extraSearchList: [],
      hospitalChecked: [],
      menuImg: "/static/images/common/menu-un.png",
      menuSelImg: "/static/images/common/menu-sel.png",
    };
  },
  computed: {
    ...mapGetters("map", [...CESIUM_TREE_EXTRA_DATA, "forceTrueTopicLabelId"]),
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      /**
       * 事件传递打开对应专题图层
       */
      this.$bus.$off("cesium-3d-switch-searchBox");
      this.$bus.$on("cesium-3d-switch-searchBox", ({ shall, node }) => {
        this.searchClear();
        this.searchBoxVisible = shall;
        this.forceNode = node || {};
        shall ? this.searchFilter() : undefined;
      });
    },
    toogleVisible() {
      this.searchBoxResult = !this.searchBoxResult;
    },
    searchClear() {
      this.searchText = "";
      this.extraSearchList = [];
      this.hospitalChecked = [];
      this.searchFilter();
    },
    searchFilter() {
      if (!this.searchBoxVisible) return;
      const featureMap = window.featureMap[this.forceNode.id];
      // const withExtraData = this[this.forceNode.withExtraData];
      const allSearchList = [];
      for (let key in featureMap) {
        const item = window.featureMap[this.forceNode.id][key];
        allSearchList.push(item);
      }
      this.extraSearchList = this.searchText
        ? allSearchList.filter((item) => ~item.name.indexOf(this.searchText))
        : allSearchList;
    },
    checkedOne(item) {
      let idIndex = this.hospitalChecked.indexOf(item.name);
      if (idIndex >= 0) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.hospitalChecked.splice(idIndex, 1);
      } else {
        // 选中该checkbox
        this.hospitalChecked = [];
        this.hospitalChecked.push(item.name);
        // 移动到对应实例位置
        const { x, y } = item.geometry;
        window.earth.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(x, y - 0.005, 450),
          orientation: {
            heading: 0.003336768850279448,
            pitch: -0.5808830390057418,
            roll: 0.0,
          },
          maximumHeight: 450,
        });
      }
    },
  },
};
</script>

<style lang="less">
@import url("./searchBox.less");
</style>
