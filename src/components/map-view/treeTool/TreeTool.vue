<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-08-13 15:25:19
 * @LastEditors: eds
 * @Description:
 * @FilePath: \旅游\src\components\map-view\treeTool\TreeTool.vue
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
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.handler && this.handler.destroy();
  },
  methods: {
    eventRegsiter_ex() {
      const that = this;
      this.viewer.scene.postRender.addEventListener(() => {
        if (!that.picked || !that.viewer) return;
        if (
          ~["people", "vr"].indexOf(that.picked.name) ||
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
          this.getPickedFeature(selectedEntity.id.split('_')[0]);
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
          if (LAYER) {
            LAYER.show = true;
          } else {
            const mvtMap = this.viewer.scene.addVectorTilesMap({
              url,
              name: node.id,
              viewer: this.viewer,
            });
            console.log(mvtMap);
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
