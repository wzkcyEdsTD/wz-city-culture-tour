<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-08-14 09:01:59
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\map-view\treeTool\TreeTool.vue
-->
<template>
  <div class="coverage">
    <el-popover
      placement="right-end"
      title="图层选择"
      width="280"
      trigger="click"
      class="layerPopover"
      v-model="visible"
    >
      <el-input v-model="filterText" class="treeFilterInput" placeholder="搜索" size="small" />
      <div class="layerTreeContainer">
        <el-tree
          ref="tree"
          :data="data"
          show-checkbox
          node-key="id"
          :filter-node-method="filterNode"
          default-expand-all
          @check-change="checkChange"
        />
      </div>
    </el-popover>
    <img
      slot="reference"
      :class="{animated: true, pulse: rotateIn}"
      style="animation-duration: 0.5s;"
      :src="avatar"
      width="59px"
      height="60px"
      @click="visible = !visible"
    />
  </div>
</template>

<script>
import $ from "jquery";
import { mapGetters, mapActions } from "vuex";
import { CESIUM_TREE_OPTION } from "config/server/cesiumTreeOption";
const Cesium = window.Cesium;
// import { BimSourceURL } from "config/server/mapConfig";
// const { SCENE_DATA_URL } = BimSourceURL;

/**
 * 2020/8/17
 * 服务名映射
 */
const serverHash = {
  爱国义务教育基地: "爱国主义教育基地",
  百姓健身房: "百姓健身房",
  温州民宿: "温州民宿",
  精品农家乐: "温州农家乐",
  旅游景点: "永嘉旅游景点地图",
  市区阅读: "温州市阅读",
  文化礼堂: "文化礼堂",
  文化生活: "温州文化生活",
  夜光经济: "夜景",
};

export default {
  name: "TreeTool",
  data() {
    return {
      rotateIn: true,
      visible: true,
      filterText: "",
      data: CESIUM_TREE_OPTION,
      imageLayer: {},
      avatar: require("common/images/coverage.png"),
      //  tile layers
      tileLayers: {},
      //  cesium Object
      viewer: undefined,
      handler: undefined,
      picked: null,
      pickedAttr: null,
    };
  },
  computed: {
    ...mapGetters(["map"]),
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.viewer = window.earth;
    // 完整显示图标
    this.viewer.scene.globe.depthTestAgainstTerrain = false;
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.handler && this.handler.destroy();
    this.viewer.entities.removeAll();
    this.viewer = undefined;
  },
  methods: {
    eventRegsiter_ex() {
      const that = this;
      this.viewer.scene.postRender.addEventListener(() => {
        if (!that.picked || !that.viewer) return;
        if (
          ~[
            "people",
            "vr",
            "爱国义务教育基地",
            "百姓健身房",
            "温州民宿",
            "精品农家乐",
            "旅游景点",
            "市区阅读",
            "文化礼堂",
            "文化生活",
            "夜光经济",
          ].indexOf(that.picked.name) ||
          that.picked.primitive._position
        ) {
          const position = that.picked._position
            ? that.picked._position._value
            : that.picked.primitive._position;
          const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            that.viewer.scene,
            position
          );
          that.$bus.$emit("cesium-3d-mvt", {
            pickResult: that.picked,
            pointToWindow,
            name: that.picked.name,
            attrs: that.pickedAttr,
          });
        }
      });
    },
    eventRegsiter() {
      this.viewer.selectedEntityChanged.addEventListener((entity) => {
        if (!this.viewer) return;
        const selectedEntity = this.viewer.selectedEntity;
        if (
          selectedEntity &&
          (~["people", "vr"].indexOf(selectedEntity.name) ||
            (selectedEntity.primitive &&
              selectedEntity.primitive._position &&
              !selectedEntity.primitive._isS3MB))
        ) {
          console.log(selectedEntity, this.tileLayers["精品民宿"]);
          this.picked = selectedEntity;
          this.getPickedFeature(selectedEntity.id.split("_")[0]);
        } else if (
          selectedEntity &&
          (~[
            "爱国义务教育基地",
            "百姓健身房",
            "温州民宿",
            "精品农家乐",
            "旅游景点",
            "市区阅读",
            "文化礼堂",
            "文化生活",
            "夜光经济",
          ].indexOf(selectedEntity.name) ||
            (selectedEntity.primitive &&
              selectedEntity.primitive._position &&
              !selectedEntity.primitive._isS3MB))
        ) {
          this.picked = selectedEntity;
          this.getPOIPickedFeature(selectedEntity.name, selectedEntity.id);
        } else {
          this.picked = null;
        }
      });
      this.eventRegsiter_ex();
      this.$bus.$off("cesium-3d-mvt-down");
      this.$bus.$on("cesium-3d-mvt-down", () => {
        this.picked = null;
      });
    },

    /**
     * 2020/8/16
     * 旅游专题数据
     */
    getPOIPickedFeature(datasetName, SMID) {
      const that = this;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID = ${SMID}`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [`172.20.83.196_swdata:${serverHash[datasetName]}`],
      });
      var url =
        "http://172.20.83.223:8090/iserver/services/data-SW_Data/rest/data";
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: (res) => {
            console.log(res);
            if (res.result.featureCount) {
              that.pickedAttr = res.result.features[0].attributes;
            }
          },
          processFailed: (msg) => {
            console.log(msg);
          },
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },

    getPickedFeature(SMID) {
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID = ${SMID}`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: ["172.20.83.196_swdata:温州民宿"],
      });
      var url =
        "http://172.20.83.223:8090/iserver/services/data-SW_Data/rest/data";
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: (result) => {
            console.log(result);
          },
          processFailed: (msg) => {
            console.log(msg);
          },
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    filterNode(value, data) {
      return !value ? true : data.label.indexOf(value) !== -1;
    },

    checkChange(node, checked, c) {
      if (checked) {
        if (node.type == "mvt" && node.map) {
          const url = node.url + node.map;
          const LAYER = this.tileLayers[node.id];

          let DS;
          if (this.viewer.dataSources.length) {
            const len = this.viewer.dataSources.length;

            for (let i = 0; i < len; i++) {
              const ds = this.viewer.dataSources.get(i);
              if (ds.name == node.id) DS = ds;
            }
          }

          if (LAYER) {
            LAYER.show = true;
          } else if (DS) {
            DS.show = true;
          } else {
            if (
              ~[
                "爱国义务教育基地",
                "百姓健身房",
                "温州民宿",
                "精品农家乐",
                "旅游景点",
                "市区阅读",
                "文化礼堂",
                "文化生活",
                "夜光经济",
              ].indexOf(node.id)
            ) {
              /**
               * 2020/8/17
               * 专题集合添加
               */
              const poiEntityCollection = new Cesium.CustomDataSource(node.id);
              this.viewer.dataSources.add(poiEntityCollection);

              let getFeatureParam,
                getFeatureBySQLService,
                getFeatureBySQLParams;
              getFeatureParam = new SuperMap.REST.FilterParameter({
                attributeFilter: `SMID >= 1`,
              });
              getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters(
                {
                  queryParameter: getFeatureParam,
                  toIndex: -1,
                  datasetNames: [`172.20.83.196_swdata:${serverHash[node.id]}`],
                }
              );
              var url =
                "http://172.20.83.223:8090/iserver/services/data-SW_Data/rest/data";
              getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
                url,
                {
                  eventListeners: {
                    processCompleted: (res) => {
                      console.log(res);
                      if (res.result.featureCount) {
                        const features = res.result.features;

                        features.map((item, index) => {
                          poiEntityCollection.entities.add(
                            new Cesium.Entity({
                              id: item.attributes.SMID,
                              position: Cesium.Cartesian3.fromDegrees(
                                item.geometry.x,
                                item.geometry.y,
                                48
                              ),
                              billboard: {
                                image: `/static/images/${node.id}.png`,
                                width: 44,
                                height: 48,
                              },
                              name: node.id,
                            })
                          );
                        });
                      }
                    },
                    processFailed: (msg) => {
                      console.log(msg);
                    },
                  },
                }
              );

              getFeatureBySQLService.processAsync(getFeatureBySQLParams);
            } else {
              const mvtMap = this.viewer.scene.addVectorTilesMap({
                url,
                name: node.id,
                viewer: this.viewer,
              });
              const layerReadyPromise = mvtMap.readyPromise;
              Cesium.when(layerReadyPromise, (data) => {
                mvtMap.setLayoutProperty(
                  mvtMap.mapboxStyle.layers[0].id,
                  "text-field",
                  "{ADDRESS}"
                );
                this.tileLayers[node.id] = mvtMap;
              });
            }
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
        node.camera && this.viewer.scene.camera.setView(node.camera);
      } else {
        const LAYER =
          node.type == "model"
            ? this.viewer.scene.layers.find(node.id)
            : this.tileLayers[node.id];
        LAYER && (LAYER.show = false);
        if (
          ~[
            "爱国义务教育基地",
            "百姓健身房",
            "温州民宿",
            "精品农家乐",
            "旅游景点",
            "市区阅读",
            "文化礼堂",
            "文化生活",
            "夜光经济",
          ].indexOf(node.id)
        ) {
          if (this.viewer.dataSources.length) {
            const len = this.viewer.dataSources.length;
            for (let i = 0; i < len; i++) {
              const ds = this.viewer.dataSources.get(i);
              if (ds.name == node.id) ds.show = false;
            }
          }
        }
        node.componentEvent &&
          this.$bus.$emit(node.componentEvent, { value: null });
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
