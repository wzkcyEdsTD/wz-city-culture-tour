<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:17
 * @LastEditTime: 2020-08-07 09:12:43
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyse.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop" :style="{width:'125px'}">
    <div class="bimanalayse tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-popover placement="top" title="图层选择" width="300" trigger="click">
                <div class="bim-analyse-tree" v-if="shallTree">
                  <el-tree
                    :data="BimTreeData"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="['all']"
                    :default-checked-keys="['all']"
                    @check-change="checkChange"
                  />
                </div>
                <el-button slot="reference">图层选择</el-button>
              </el-popover>
              <el-button v-show="false" class="elformbtn" @click="closeBimAnalyse">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
import { queryFloorByBottom } from "./BimAnalyseFloorSection";
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
const LAYER_NAME = "Block1";
const DATASOURCE_NAME = "第一栋";
export default {
  name: "BimAnalyse",
  data() {
    return {
      shallTree: false,
      keys: [],
      BimTreeData: [{ id: "all", label: "图层控制", children: [] }],
      BimHash: {},
      endID: 0,
      //  floor IDS
      IDS: [],
      FLOOR_ON: false,
      //  cesium Object
      viewer: undefined,
      handler: undefined,
      lastHouseEntity: undefined,
      //  节流
      count: 0,
      fnScroll: () => {},
    };
  },
  computed: {
    ...mapGetters("map", ["forceBimIDS"]),
  },
  watch: {
    BimTreeData: {
      handler(n, o) {
        n[0].children.length == 1 && (this.shallTree = true);
      },
      deep: true,
    },
  },
  created() {
    this.viewer = window.earth;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.clearBimAnalyse();
    this.handler.destroy();
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", [
      "SetForceBimData",
      "SetForceRoomData",
      "SetForceBimIDS",
    ]),
    fnThrottle(fn, delay, atleast) {
      //节流函数
      let timer = null;
      let previous = null;
      return function () {
        let now = +new Date();
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
          fn();
          previous = now;
          clearTimeout(timer);
        } else {
          clearTimeout(timer);
          timer = setTimeout(() => {
            fn();
            previous = null;
          }, delay);
        }
      };
    },
    //  事件绑定
    eventRegsiter() {
      const that = this;
      this.$bus.$off("cesium-3d-floorDIS");
      this.$bus.$on("cesium-3d-floorDIS", (value) => {
        const layer = this.viewer.scene.layers.find(LAYER_NAME);
        if (value) {
          layer.setObjsVisible(this.forceBimIDS, true);
        } else {
          const IDS = [];
          const endID = this.endID;
          for (let i = 0; i < endID + 1; i++) {
            IDS.push(i);
          }
          layer.setObjsVisible(IDS, true);
        }
      });

      that.handler.setInputAction((e) => {
        let position = that.viewer.scene.pickPosition(e.position);
        !position && (position = Cesium.Cartesian3.fromDegrees(0, 0, 0));
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        that.bindDataSQL({ x: longitude, y: latitude, z: height });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //  相机移动
    cameraMove() {
      window.earth.scene.camera.setView({
        destination: {
          x: -2875539.090787695,
          y: 4842735.556374235,
          z: 2993566.8100139066,
        },
        orientation: {
          heading: 0.00000410168472608774,
          pitch: -0.5655332606839059,
          roll: 0,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME);
      if (_LAYER_) {
        _LAYER_.visible = true;
      } else {
        const { SCENE_URL, SCENE_DATA_URL } = BimSourceURL;
        // const promise = this.viewer.scene.open(SCENE_URL);
        const promise = this.viewer.scene.addS3MTilesLayerByScp(
          `${SCENE_URL}/datas/${LAYER_NAME}/config`,
          { name: LAYER_NAME }
        );
        Cesium.when(promise, async (layers) => {
          const layer = this.viewer.scene.layers.find(LAYER_NAME);
          layer.setQueryParameter({
            url: SCENE_DATA_URL,
            dataSourceName: DATASOURCE_NAME,
            isMerge: true,
          });
          const color = new Cesium.Color.fromCssColorString(
            "rgba(23,92,239,0.3)"
          );
          layer.selectedColor = color;
          layer.datasetInfo().then((result) => {
            const bimHash = {};
            let endID = 0;
            this.keys = [...this.keys, ...result.map((v) => v.datasetName)];
            this.BimTreeData[0].children.push({
              id: DATASOURCE_NAME,
              label: DATASOURCE_NAME,
              children: result.map((v, index) => {
                bimHash[v.datasetName] = v.startID;
                endID = endID <= v.endID ? v.endID : endID;
                return {
                  id: `${DATASOURCE_NAME}_${index}`,
                  label: v.datasetName,
                  startID: v.startID,
                  endID: v.endID,
                };
              }),
            });
            this.endID = endID;
            this.bimHash = bimHash;
          });
        });
      }
    },
    //  属性表SQL查询（三维每）
    bindDataSQL({ x, y, z }) {
      const that = this;
      const { SCENE_DATA_URL } = BimSourceURL;
      $.ajax({
        type: "post",
        url: SCENE_DATA_URL + "/featureResults.rjson?returnContent=true",
        data: JSON.stringify({
          getFeatureMode: "SPATIAL",
          spatialQueryMode: "INTERSECT",
          datasetNames: ["Block_2D:Block_2D"],
          geometry: {
            id: 0,
            parts: [1],
            points: [{ x, y }],
            type: "POINT",
          },
        }),
        success: (result) => {
          that.onQueryComplete(JSON.parse(result).features, z);
        },
        error: (msg) => {
          console.log(msg);
        },
      });
    },
    //  楼层贴皮
    onQueryComplete(features, height) {
      const layer = this.viewer.scene.layers.find(LAYER_NAME);
      if (this.lastHouseEntity) {
        this.viewer.entities.remove(this.lastHouseEntity);
        this.lastHouseEntity = null;
        this.SetForceRoomData([]);
      }
      const selectedFloors = features.filter(({ fieldNames, fieldValues }) => {
        const BOTTOM = fieldNames.indexOf("BOTTOM");
        const LSG = fieldNames.indexOf("LSG");
        const isTheFloor =
          BOTTOM > -1 &&
          LSG > -1 &&
          parseFloat(fieldValues[BOTTOM]) <= height &&
          parseFloat(fieldValues[BOTTOM]) + parseFloat(fieldValues[LSG]) >=
            height;
        return isTheFloor;
      });
      const selectedFeature = selectedFloors.length ? selectedFloors[0] : null;
      if (
        !selectedFeature ||
        !selectedFeature.geometry ||
        !selectedFeature.geometry.points
      )
        return;
      var bottomHeight = Number(
        selectedFeature.fieldValues[
          selectedFeature.fieldNames.indexOf("BOTTOM")
        ]
      ); // 底部高程
      var extrudeHeight = Number(
        selectedFeature.fieldValues[selectedFeature.fieldNames.indexOf("LSG")]
      ); // 层高（拉伸高度）
      //  获取该楼层所有ids
      queryFloorByBottom(
        this,
        Math.floor(bottomHeight / extrudeHeight) + "F",
        this.bimHash,
        layer
      );
      Cesium.GroundPrimitive.bottomAltitude = bottomHeight;
      Cesium.GroundPrimitive.extrudeHeight = extrudeHeight;
      var points3D = [];
      for (var pt of selectedFeature.geometry.points) {
        points3D.push(pt.x, pt.y);
      }
      this.lastHouseEntity = this.viewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(points3D),
          material: new Cesium.Color(223 / 255, 199 / 255, 0 / 255, 0.4),
        },
        clampToS3M: true, // 贴在S3M模型表面
      });
      this.SetForceRoomData(
        selectedFeature.fieldNames.map((k, i) => {
          return { k, v: selectedFeature.fieldValues[i] };
        })
      );
    },
    //  树结构改变
    checkChange(...params) {
      const array = [];
      const nodes = this.$refs.tree
        .getCheckedNodes()
        .filter((v) => !v.children)
        .map((v) => {
          for (let i = v.startID; i < v.endID + 1; i++) {
            array.push(i);
          }
        });
      const layer = this.viewer.scene.layers.find(LAYER_NAME);
      this.fnThrottle(layer.setObjsVisible(array, true), 1000);
    },
    //  关闭BIM分析模块
    closeBimAnalyse() {
      this.clearBimAnalyse();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearBimAnalyse() {
      this.viewer.scene.layers.find(LAYER_NAME).visible = false;
    },
    //  关闭详情框
    closeBimFrame() {
      this.SetForceBimData([]);
      this.SetForceRoomData([]);
      this.SetForceBimIDS([]);
    },
  },
};
</script>
