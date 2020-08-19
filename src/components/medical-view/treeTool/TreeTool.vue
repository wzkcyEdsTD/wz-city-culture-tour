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
      style="animation-duration: 0.5s; cursor: pointer;"
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
import { CESIUM_TREE_OPTION } from "config/server/medicalTreeOption";
const Cesium = window.Cesium;
// import { BimSourceURL } from "config/server/mapConfig";
// const { SCENE_DATA_URL } = BimSourceURL;

// import { getAccessToken, getFarebr } from "api/fetch";

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
      pickedList: [],
      pickedAttr: null,
      entityMap: {},
      pickAttrs: [],

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
  async mounted() {
    this.eventRegsiter();

    /**
     * 2020/8/19
     * 请求发热数据
     */
    // const accessToken = await getAccessToken();
    // console.log(accessToken);
    // const result = await getFarebr(accessToken.data.access_token);
    // console.log(result.data.data);
  },
  beforeDestroy() {
    this.handler && this.handler.destroy();
    this.viewer.entities.removeAll();
    this.viewer = undefined;
  },
  methods: {
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
        // console.log(extent)

        const pointList = [];
        const attrList = [];

        const newList = [];

        const aa = [];
        const aap = [];

        that.pickedList.map((item) => {
          if (item.geometry) {
            if (
              item.geometry.x >= extent.xmin &&
              item.geometry.y >= extent.ymin &&
              item.geometry.x <= extent.xmax &&
              item.geometry.y <= extent.ymax
            ) {
              aa.push(item);
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

        // console.log(aa);

        that.$bus.$emit("cesium-3d-mvt", {
          scene: that.viewer.scene,
          pickedList: newList,
          pointList,
        });

        // if (
        //   ~["people", "vr"].indexOf(that.picked.name) ||
        //   (that.picked.id && that.picked.id.split("@")[1]) ||
        //   that.picked.primitive._position
        // ) {
        //   /* const position = that.picked._position
        //     ? that.picked._position._value
        //     : that.picked.primitive._position;
        //   const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        //     that.viewer.scene,
        //     position
        //   ); */
        //   that.$bus.$emit("cesium-3d-mvt", {
        //     pickList: that.pickedList,
        //   });
        // }
      });
    },
    eventRegsiter() {
      /* this.viewer.selectedEntityChanged.addEventListener((entity) => {
        if (!this.viewer) return;
        const selectedEntity = this.viewer.selectedEntity;
        if (selectedEntity && ~["people", "vr"].indexOf(selectedEntity.name)) {
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
      }); */

      this.eventRegsiter_ex();
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
        datasetNames: [`172.20.83.196_swdata:${datasetName}`],
      });
      var url =
        "http://172.20.83.223:8098/iserver/services/data-SW_Data/rest/data";
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: (res) => {
            if (SMID != null && res.result.featureCount) {
              this.pickedAttr = res.result.features[0].attributes;

              /* res.result.features.map((item) => {
                that.pickAttrs.push(item.attributes);
              }); */
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
            /* billboard: {
              image: `/static/images/${node.icon}.png`,
              width: 48,
              height: 52,
            }, */
            name: node.id,
            attributes: item.attributes,
            geometry: item.geometry,
          })
        );
      });

      this.pickedList = [
        ...this.pickedList,
        ...poiEntityCollection.entities.values,
      ];
    },

    filterNode(value, data) {
      return !value ? true : data.label.indexOf(value) !== -1;
    },

    checkChange(node, checked, c) {
      if (checked) {
        if (node.type == "mvt" && node.map && node.icon) {
          if (node.id && this.entityMap[node.id]) {
            this.entityMap[node.id].show = true;
            this.pickedList = [
              ...this.pickedList,
              ...this.entityMap[node.id].entities.values,
            ];
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

          this.pickedList = [];

          Object.values(this.entityMap).map((item) => {
            if (item.show) {
              this.pickedList = [...this.pickedList, ...item.entities.values];
            }
          });
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
