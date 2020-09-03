<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-09-03 19:44:12
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\treeTool\TreeTool.vue
-->
<template>
  <div class="medical-coverage">
    <div class="header">
      <p class="title">资源图层</p>
      <img
        class="menu"
        :src="visible||serachBoxVisible?menuSelImg:menuImg"
        width="59px"
        @click="toogleVisible"
      />
    </div>
    <el-popover
      placement="right-end"
      width="280"
      trigger="click"
      class="layerPopover"
      v-model="visible"
    >
      <div class="layerTreeContainer">
        <el-tree
          ref="tree"
          :data="data"
          show-checkbox
          node-key="label"
          :filter-node-method="filterNode"
          default-expand-all
          @check-change="checkChange"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
            <span v-if="node.label == '医疗场所'">
              <i class="icon-search" @click="showSearchBox(node.label)"></i>
            </span>
          </span>
        </el-tree>
      </div>
    </el-popover>
    <el-popover
      placement="right-end"
      width="280"
      trigger="click"
      class="layerPopover searchBox"
      v-model="serachBoxVisible"
    >
      <div class="searchHeader">
        <el-input
          v-model="searchText"
          class="searchFilterInput"
          placeholder="温州附近的医院有哪些？"
          size="small"
          @keyup.enter.native="searchFilter"
        />
        <div class="button-container">
          <div class="button-item">
            <i class="icon-common icon-clear" @click="searchClear"></i>
          </div>
          <div class="button-item">
            <i class="icon-common icon-back" @click="backToTree"></i>
          </div>
          <div class="button-item">
            <i class="icon-common icon-search" @click="searchFilter"></i>
          </div>
        </div>
      </div>
      <ul class="result-list">
        <li
          class="result-item"
          :class="{checked: ~hospitalChecked.indexOf(item.attributes.SHORTNAME)}"
          v-for="item in hospitalList"
          :key="item.attributes.SMID"
        >
          <div class="left">
            <p class="name">{{item.attributes.SHORTNAME}}</p>
            <div class="address">
              <i class="icon-position"></i>
              <span>{{item.attributes.ADDRESS}}</span>
            </div>
          </div>
          <div class="right">
            <input
              type="checkbox"
              :checked="hospitalChecked.indexOf(item.attributes.SHORTNAME)>=0"
              @click="checkedOne(item)"
            />
          </div>
        </li>
      </ul>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { treeDrawTool, fixTreeWithExtra } from "./TreeDrawTool";
import {
  CESIUM_TREE_OPTION,
  CESIUM_TREE_EXTRA_DATA,
  CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY,
} from "config/server/medicalTreeOption";
const Cesium = window.Cesium;

export default {
  name: "TreeTool",
  data() {
    return {
      visible: true,
      serachBoxVisible: false,
      searchText: "",
      hospitalList: [],
      hospitalChecked: [],
      data: CESIUM_TREE_OPTION,
      avatar: require("common/images/coverage.png"),
      menuImg: require("common/images/menu-un.png"),
      menuSelImg: require("common/images/menu-sel.png"),
      //  tile layers
      tileLayers: {},
      //  cesium Object
      pickedList: [],
      entityMap: {},
      featureMap: {}, //  源数据,量小
    };
  },
  computed: {
    ...mapGetters("map", CESIUM_TREE_EXTRA_DATA),
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", CESIUM_TREE_EXTRA_DATA_WITH_GEOMETRY),
    eventRegsiter() {
      /**
       * 事件传递打开对应专题图层
       */
      this.$bus.$off("check-tree");
      this.$bus.$on("check-tree", ({ key }) => {
        this.$refs.tree.setCheckedKeys([key]);
      });
    },
    /**
     * 2020/8/16
     * 旅游专题数据
     * @param {object} node
     */
    getPOIPickedFeature(node) {
      const { newdataset, url } = node;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID <= 1000`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [newdataset],
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: (res) => treeDrawTool(this, res, node),
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    filterNode(value, data) {
      return !value ? true : data.label.indexOf(value) !== -1;
    },
    checkChange(node, checked) {
      if (checked) {
        if (node.type == "mvt" && node.id) {
          if (node.id && this.entityMap[node.id]) {
            this.entityMap[node.id].show = true;
            //  若该节点有额外数据/模块,则触发
            node.withExtraData
              ? fixTreeWithExtra(
                  this.featureMap[node.id],
                  this[node.withExtraData],
                  node,
                  this
                )
              : null;
          } else {
            this.getPOIPickedFeature(node);
          }
        } else if (node.type == "model") {
          node.componentEvent &&
            node.componentKey &&
            this.$bus.$emit(node.componentEvent, { value: node.componentKey });
        } else if (node.type == "image") {
          const LAYER = this.tileLayers[node.id];
          this.tileLayers[
            node.id
          ] = window.earth.imageryLayers.addImageryProvider(
            new Cesium.SuperMapImageryProvider({
              url: node.url,
              name: node.id,
            })
          );
        }
        //  有相机视角配置 -> 跳视角
        node.camera && window.earth.scene.camera.setView(node.camera);
      } else {
        const LAYER =
          node.type == "model"
            ? window.earth.scene.layers.find(node.id)
            : this.tileLayers[node.id];
        LAYER && (LAYER.show = false);
        if (
          node.icon &&
          this.entityMap[node.id] &&
          window.earth.dataSources.length
        ) {
          this.entityMap[node.id].show = false;
          if (node.withExtraData) {
            this[node.saveExtraDataByGeometry]([]);
          }
        }
        node.componentEvent &&
          this.$bus.$emit(node.componentEvent, { value: null });
      }
    },
    toogleVisible() {
      this.serachBoxVisible = false;
      this.visible = !this.visible;
    },
    showSearchBox(key) {
      this.$refs.tree.setCheckedKeys([key]);
      this.visible = false;
      this.serachBoxVisible = true;
    },
    searchClear() {
      this.searchText = "";
    },
    backToTree() {
      this.searchClear();
      this.serachBoxVisible = false;
      this.visible = true;
    },
    searchFilter() {
      this.hospitalList = this.searchText
        ? this.pickedList.filter((item) => {
            return item.attributes.SHORTNAME.indexOf(this.searchText) >= 0;
          })
        : this.pickedList;
    },
    checkedOne(item) {
      let idIndex = this.hospitalChecked.indexOf(item.attributes.SHORTNAME);
      if (idIndex >= 0) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.hospitalChecked.splice(idIndex, 1);
      } else {
        // 选中该checkbox
        this.hospitalChecked = [];
        this.hospitalChecked.push(item.attributes.SHORTNAME);

        // 移动到对应实例位置
        window.earth.zoomTo(item);
      }
    },
    // 三维定位
    setview(cameraSight) {
      window.earth.scene.camera.setView({
        // 将经度、纬度、高度的坐标转换为笛卡尔坐标
        destination: cameraSight,
        orientation: {
          heading: 5.6326,
          pitch: -0.40149976501196627,
          roll: 6.283185307179572,
        },
      });
    },
  },
};
</script>

<style lang="less">
@import url("./TreeTool.less");
</style>
