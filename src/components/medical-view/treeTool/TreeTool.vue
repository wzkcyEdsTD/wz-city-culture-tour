<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-08-24 13:48:42
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\treeTool\TreeTool.vue
-->
<template>
  <div class="coverage">
    <div class="header">
      <p class="title">资源图层</p>
      <img class="menu"
        :src="visible?menuSelImg:menuImg"
        width="59px"
        @click="toogleVisible"
      />
    </div>
    <!-- <el-input v-model="filterText" class="treeFilterInput" placeholder="搜索" size="small" /> -->
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
      class="layerPopover"
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
          <i class="icon-common icon-clear" @click="searchClear"></i>
          <i class="icon-common icon-back" @click="backToTree"></i>
          <i class="icon-common icon-search" @click="searchFilter"></i>
        </div>
      </div>
      <ul class="result-list">
        <li class="result-item" v-for="item in hospitalList" :key="item.attributes.SMID">
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
    <!-- <img
      slot="reference"
      :class="{animated: true, pulse: rotateIn}"
      style="animation-duration: 0.5s; cursor: pointer;"
      :src="avatar"
      width="59px"
      height="60px"
      @click="toogleVisible"
    /> -->
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters, mapActions } from "vuex";
import { CESIUM_TREE_OPTION } from "config/server/medicalTreeOption";
import { DataServer } from "./mapconfig";
const Cesium = window.Cesium;
// import { BimSourceURL } from "config/server/mapConfig";
// const { SCENE_DATA_URL } = BimSourceURL;

export default {
  name: "TreeTool",
  data() {
    return {
      rotateIn: true,
      visible: true,
      serachBoxVisible: false,
      filterText: "",
      searchText: "",
      hospitalList: [],
      hospitalChecked: [],
      data: CESIUM_TREE_OPTION,
      imageLayer: {},
      avatar: require("common/images/coverage.png"),
      menuImg: require("common/images/menu-un.png"),
      menuSelImg: require("common/images/menu-sel.png"),
      //  tile layers
      tileLayers: {},
      //  cesium Object
      viewer: undefined,
      handler: undefined,
      pickedList: [],
      pickedAttr: null,
      entityMap: {},
    };
  },
  computed: {
    ...mapGetters("map", ["feverList"]),
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    searchText(val) {
      if (val === "") {
        this.hospitalList = this.pickedList;
      }
    },
  },
  created() {
    this.viewer = window.earth;
  },
  async mounted() {
    this.eventRegsiter_ex();

    await this.SetFeverList();
    const feverObj = {};

    this.feverList.map((item) => {
      if (!feverObj[item.name]) {
        feverObj[item.name] = parseInt(item.value);
      }
    });

    this.feverObj = feverObj;
    console.log(feverObj);
  },
  beforeDestroy() {
    this.handler && this.handler.destroy();
    this.viewer.entities.removeAll();
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", ["SetFeverList"]),
    // 获取当前视野范围
    getCurrentExtent(ctx) {
      var extent = {};
      var scene = ctx.viewer.scene;
      var ellipsoid = scene.globe.ellipsoid;
      var canvas = scene.canvas;
      var car3_lt = ctx.viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(0, 0),
        ellipsoid
      );
      var car3_rb = ctx.viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(canvas.width, canvas.height),
        ellipsoid
      );
      // 当canvas左上角和右下角全部在椭球体上
      if (car3_lt && car3_rb) {
        var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
        var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
        extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
      } else if (!car3_lt && car3_rb) {
        // 当canvas左上角不在但右下角在椭球体上
        var car3_lt2 = null;
        var yIndex = 0;
        do {
          // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
          yIndex <= canvas.height ? (yIndex += 10) : canvas.height;
          car3_lt2 = this.rightMap.camera.pickEllipsoid(
            new Cesium.Cartesian2(0, yIndex),
            ellipsoid
          );
        } while (!car3_lt2);
        var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
        var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
        extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
      }
      return extent;
    },

    eventRegsiter_ex() {
      const that = this;
      this.viewer.scene.postRender.addEventListener(() => {
        if (!that.pickedList || !that.viewer) return;

        const extent = this.getCurrentExtent(that);

        const pointList = [];

        const newList = [];

        that.pickedList.map((item) => {
          if (item.geometry) {
            if (
              item.geometry.x >= extent.xmin &&
              item.geometry.y >= extent.ymin &&
              item.geometry.x <= extent.xmax &&
              item.geometry.y <= extent.ymax
            ) {
              const position = item._position
                ? item._position._value
                : item.primitive._position;
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                that.viewer.scene,
                position
              );

              pointList.push(pointToWindow);
              newList.push(item);
            }
          }
        });

        that.$bus.$emit("cesium-3d-mvt", {
          scene: that.viewer.scene,
          pickedList: newList,
          pointList,
        });
      });
    },
    eventRegsiter() {
      this.eventRegsiter_ex();
    },

    /**
     * 2020/8/16
     * 旅游专题数据
     */
    getPOIPickedFeature(SMID, node) {
      const that = this;
      let currentDataServer = DataServer[node.label]
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID ${SMID == null ? `>= 1` : `= ${SMID}`}`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [currentDataServer.datasetname]
      });
      var url = currentDataServer.url
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: (res) => {
            if (SMID != null && res.result.featureCount) {
              this.pickedAttr = res.result.features[0].attributes;
            } else {
              this.completed(res, node);
            }
          },
          processFailed: (msg) => {
            console.log(msg);
          },
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },

    // 查询完成
    completed(res, node) {
      const that = this;
      /**
       * 2020/8/20
       * 筛选显示气泡框
       */
      const poiLabelEntityCollection = new Cesium.CustomDataSource(
        `${node.id}_label`
      );
      this.viewer.dataSources
        .add(poiLabelEntityCollection)
        .then((datasource) => {
          this.entityMap[`${node.id}_label`] = datasource;
        });

      const poiEntityCollection = new Cesium.CustomDataSource(node.id);
      this.viewer.dataSources.add(poiEntityCollection).then((datasource) => {
        this.entityMap[node.id] = datasource;
      });

      const features = res.result.features;
      const sArr = Object.keys(that.feverObj);

      features.map((item) => {
        if (~sArr.indexOf(item.attributes.SHORTNAME)) {
          poiLabelEntityCollection.entities.add(
            new Cesium.Entity({
              id: `${item.attributes.SMID}@${node.icon}@${node.dataset}`,
              position: Cesium.Cartesian3.fromDegrees(
                item.geometry.x,
                item.geometry.y,
                30
              ),
              point: {
                color: Cesium.Color.WHITE.withAlpha(0.1),
                outlineColor: Cesium.Color.WHITE.withAlpha(0.1),
              },
              name: node.id,
              feverNum: that.feverObj[item.attributes.SHORTNAME],
              attributes: item.attributes,
              geometry: item.geometry,
            })
          );
        } else {
          poiEntityCollection.entities.add(
            new Cesium.Entity({
              id: `${item.attributes.SMID}@${node.icon}@${node.dataset}`,
              position: Cesium.Cartesian3.fromDegrees(
                item.geometry.x,
                item.geometry.y,
                30
              ),
              billboard: {
                image: `/static/images/${node.icon}.png`,
                width: node.icon_size == 0 ? 48 : 32,
                height: node.icon_size == 0 ? 52 : 35,
              },
              label: {
                text: item.attributes.SHORTNAME || item.attributes.NAME,
                font: "10px",
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                  0,
                  2000
                ),
                pixelOffset: new Cesium.Cartesian2(0, -40),
              },
              name: node.id,
              geometry: item.geometry,
            })
          );
        }
      });

      this.pickedList = [
        ...this.pickedList,
        ...poiLabelEntityCollection.entities.values,
      ];
      this.hospitalList = this.pickedList;
    },

    filterNode(value, data) {
      return !value ? true : data.label.indexOf(value) !== -1;
    },

    checkChange(node, checked, c) {
      if (checked) {
        if (node.type == "mvt" && node.map && node.icon) {
          if (node.id && this.entityMap[node.id]) {
            this.entityMap[node.id].show = true;

            if (this.entityMap[`${node.id}_label`]) {
              this.entityMap[`${node.id}_label`].show = true;
              this.pickedList = [
                ...this.pickedList,
                ...this.entityMap[`${node.id}_label`].entities.values,
              ];
            }
            return;
          }

          // 专题集合添加
          this.getPOIPickedFeature(null, node);
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
        node.camera && this.viewer.scene.camera.setView(node.camera);
      } else {
        const LAYER =
          node.type == "model"
            ? this.viewer.scene.layers.find(node.id)
            : this.tileLayers[node.id];
        LAYER && (LAYER.show = false);

        // dataSources 实体集合隐藏
        if (
          node.icon &&
          this.entityMap[node.id] &&
          this.viewer.dataSources.length
        ) {
          this.entityMap[node.id].show = false;

          this.entityMap[`${node.id}_label`] &&
            (this.entityMap[`${node.id}_label`].show = false);

          this.pickedList = [];

          Object.values(this.entityMap).map((item) => {
            if (item.show && item.name.includes("_label")) {
              this.pickedList = [...this.pickedList, ...item.entities.values];
            }
          });
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
      // console.log('showSearchBox', this.hospitalList)
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
      this.hospitalList = this.pickedList.filter((item) => {
        return item.attributes.SHORTNAME.indexOf(this.searchText) >= 0;
      });
    },

    checkedOne(item) {
      // console.log('checkedOne', item)
      let idIndex = this.hospitalChecked.indexOf(item.attributes.SHORTNAME);
      if (idIndex >= 0) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.hospitalChecked.splice(idIndex, 1);
      } else {
        // 选中该checkbox
        this.hospitalChecked = [];
        this.hospitalChecked.push(item.attributes.SHORTNAME);

        // 移动到对应实例位置
        this.viewer.zoomTo(item);
      }
      // console.log('hospitalChecked', this.hospitalChecked)
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
