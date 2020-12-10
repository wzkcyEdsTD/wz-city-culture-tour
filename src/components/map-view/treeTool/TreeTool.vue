<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-08-22 16:03:43
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\map-view\treeTool\TreeTool.vue
-->
<template>
  <div class="map-coverage">
    <el-popover
      placement="right-end"
      title="图层选择"
      width="280"
      trigger="click"
      class="layerPopover"
      v-model="visible"
    >
      <el-input
        v-model="filterText"
        class="treeFilterInput"
        placeholder="搜索"
        size="small"
      />
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
      :class="{ animated: true, pulse: rotateIn }"
      style="animation-duration: 0.5s"
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

export default {
  name: "TreeTool",
  data() {
    return {
      rotateIn: true,
      visible: true,
      filterText: "",
      data: CESIUM_TREE_OPTION,
      imageLayer: {},
      avatar: "/static/images/common/coverage.png",
      //  tile layers
      tileLayers: {},
      //  cesium Object
      viewer: undefined,
      handler: undefined,
      picked: null,
      pickedAttr: null,
      entityMap: {},
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
    this.viewer.entities.removeAll();
    this.viewer = undefined;
  },
  methods: {
    eventRegsiter_ex() {
      const that = this;
      this.viewer.scene.postRender.addEventListener(() => {
        if (!that.picked || !that.viewer) return;
        if (
          ~["people", "vr", "travel"].indexOf(that.picked.name) ||
          (that.picked.id && that.picked.id.split("@")[1]) ||
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
          ~["people", "vr", "travel"].indexOf(selectedEntity.name)
        ) {
          this.picked = selectedEntity;
        } else if (
          selectedEntity &&
          selectedEntity.id &&
          selectedEntity.id.split("@")[1]
        ) {
          this.picked = selectedEntity;
          this.getPOIPickedFeature(
            selectedEntity.id.split("@")[2],
            selectedEntity.id.split("@")[0]
          );
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
    getPOIPickedFeature(datasetName, SMID, node) {
      const that = this;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID ${SMID == null ? `>= 1` : `= ${SMID}`}`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [`swdata:${datasetName}`],
      });
      var url =
        "http://172.20.83.223:8090/iserver/services/data-SW_Data/rest/data";
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
      const poiEntityCollection = new Cesium.CustomDataSource(node.id);
      this.viewer.dataSources.add(poiEntityCollection).then((datasource) => {
        this.entityMap[node.id] = datasource;
      });
      const features = res.result.features;
      features.map((item) => {
        poiEntityCollection.entities.add(
          new Cesium.Entity({
            id: `${item.attributes.SMID}@${node.icon}@${node.dataset}`,
            position: Cesium.Cartesian3.fromDegrees(
              item.geometry.x,
              item.geometry.y,
              48
            ),
            billboard: {
              image: `/static/images/${node.icon}.png`,
              width: 44,
              height: 48,
            },
            name: node.id,
          })
        );
      });
    },

    filterNode(value, data) {
      return !value ? true : data.label.indexOf(value) !== -1;
    },

    checkChange(node, checked, c) {
      if (checked) {
        if (node.type == "mvt" && node.map && node.icon) {
          if (node.id && this.entityMap[node.id]) {
            this.entityMap[node.id].show = true;
            return;
          }
          // 专题集合添加
          this.getPOIPickedFeature(node.dataset, null, node);
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
