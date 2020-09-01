<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-09-01 15:07:35
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
    <!-- <img
      slot="reference"
      :class="{animated: true, pulse: rotateIn}"
      style="animation-duration: 0.5s; cursor: pointer;"
      :src="avatar"
      width="59px"
      height="60px"
      @click="toogleVisible"
    />-->
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters, mapActions } from "vuex";
import { CESIUM_TREE_OPTION } from "config/server/medicalTreeOption";
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
      handler: undefined,
      pickedList: [],
      pickedAttr: null,
      entityMap: {},
      timer: null,
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
  async mounted() {
    this.eventRegsiter();
    await this.fetchFeverList();
  },
  beforeDestroy() {
    this.handler && this.handler.destroy();
    window.earth.entities.removeAll();
  },
  methods: {
    ...mapActions("map", ["SetFeverList"]),
    eventRegsiter() {
      // 根据父窗口参数选中对应图层
      this.$bus.$off("check-tree");
      this.$bus.$on("check-tree", ({ key }) => {
        console.log("oncheck-tree!!!");
        this.timer = setInterval(() => {
          if (this.feverObj) {
            this.$refs.tree.setCheckedKeys([key]);
            clearInterval(this.timer);
          }
        }, 200);
      });
    },
    /**
     * 发热人数获取
     */
    async fetchFeverList() {
      await this.SetFeverList();
      const feverObj = {};
      this.feverList.map((item) => {
        if (!feverObj[item.name]) {
          feverObj[item.name] = parseInt(item.value);
        }
      });
      this.feverObj = feverObj;
    },
    /**
     * 2020/8/16
     * 旅游专题数据
     */
    getPOIPickedFeature(SMID, node) {
      const that = this;
      let currentDataServer;
      CESIUM_TREE_OPTION.forEach((item) => {
        item.children.forEach((citem) => {
          if (node.label === citem.label) {
            currentDataServer = citem;
          }
        });
      });
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID ${SMID == null ? `>= 1` : `= ${SMID}`}`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [currentDataServer.newdataset],
      });
      var url = currentDataServer.url;
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
      window.earth.dataSources
        .add(poiLabelEntityCollection)
        .then((datasource) => {
          this.entityMap[`${node.id}_label`] = datasource;
        });

      const poiEntityCollection = new Cesium.CustomDataSource(node.id);
      window.earth.dataSources.add(poiEntityCollection).then((datasource) => {
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
          const entityOption = {
            id: `${item.attributes.SMID}@${node.icon}@${node.dataset}`,
            label: {
              text: item.attributes.SHORTNAME || item.attributes.NAME,
              color: Cesium.Color.fromCssColorString("#fff"),
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              font: "10px",
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0,
                2000
              ),
              pixelOffset: new Cesium.Cartesian2(0, -40),
            },
            name: node.id,
            geometry: item.geometry,
          };
          const polygonGeometry = node.polygon
            ? [].concat.apply(
                [],
                item.geometry.components[0].components.map((v) => [
                  parseFloat(v.x),
                  parseFloat(v.y),
                ])
              )
            : [];
          const entityInstance = node.polygon
            ? {
                ...entityOption,
                position: Cesium.Cartesian3.fromDegrees(
                  ...this.getCenterOfPolygon(polygonGeometry, 30)
                ),
                polygon: {
                  hierarchy: Cesium.Cartesian3.fromDegreesArray(
                    polygonGeometry
                  ),
                  outline: true,
                  outlineWidth: 4,
                  outlineColor: new Cesium.Color.fromCssColorString("#FFD700"),
                  material: new Cesium.Color.fromCssColorString(
                    "#7FFF00"
                  ).withAlpha(0.6),
                  perPositionHeight: true,
                  height: 2,
                },
              }
            : {
                ...entityOption,
                position: Cesium.Cartesian3.fromDegrees(
                  item.geometry.x,
                  item.geometry.y,
                  30
                ),
                billboard: {
                  image: `/static/images/${node.icon}.png`,
                  width: node.icon_size == "large" ? 48 : 32,
                  height: node.icon_size == "large" ? 52 : 35,
                },
              };

          poiEntityCollection.entities.add(
            new Cesium.Entity(
              Object.assign(
                entityOption,
                node.detail ? { extra_data: item.attributes } : {}
              )
            )
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
        if (node.type == "mvt" && node.id) {
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
        node.camera && window.earth.scene.camera.setView(node.camera);
      } else {
        const LAYER =
          node.type == "model"
            ? window.earth.scene.layers.find(node.id)
            : this.tileLayers[node.id];
        LAYER && (LAYER.show = false);

        // dataSources 实体集合隐藏
        if (
          node.icon &&
          this.entityMap[node.id] &&
          window.earth.dataSources.length
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
    getCenterOfPolygon(arr, height) {
      let x = 0,
        y = 0;
      arr.map((v, index) => {
        index % 2 == 0 ? (x += v) : (y += v);
      });
      return [(x * 2) / arr.length, (y * 2) / arr.length, height];
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
      this.hospitalList = this.pickedList.filter((item) => {
        return item.attributes.SHORTNAME.indexOf(this.searchText) >= 0;
      });
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
