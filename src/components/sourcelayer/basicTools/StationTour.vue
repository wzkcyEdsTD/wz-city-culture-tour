<!--
 * @Author: eds
 * @Date: 2020-07-28 09:41:59
 * @LastEditTime: 2020-08-06 14:30:28
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\StationTour.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop" :style="{width:'565px'}">
    <div class="stationtour tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-popover placement="top" title="图层选择" width="300" trigger="click">
                <div class="bim-analyse-tree" v-if="shallTree">
                  <el-tree
                    :data="StationTreeData"
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
              <el-button class="elformbtn" :disabled="!tourOn" @click="startStationTour">开始漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="pauseStationTour">暂停漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="stopStationTour">停止漫游</el-button>
              <el-button class="elformbtn" :disabled="!tourOn" @click="cameraMove">视角调整</el-button>
              <el-button class="elformbtn" v-show="false" @click="closeStationTour">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
const Cesium = window.Cesium;
import { mapActions } from "vuex";
const LAYER_NAME = [
  "顶板",
  "机场站-B1",
  "机场站-B2",
  "机场站标识",
  "机场站标注",
];
export default {
  name: "StationTour",
  data() {
    return {
      shallTree: false,
      keys: [],
      StationTreeData: [{ id: "all", label: "图层控制", children: [] }],
      tourOn: false,
      // cesium Object
      viewer: undefined,
      flyManager: undefined,
    };
  },
  watch: {
    StationTreeData: {
      handler(n, o) {
        n[0].children.length == 3 && (this.shallTree = true);
      },
      deep: true,
    },
  },
  created() {
    this.viewer = window.earth;
    const routes = new Cesium.RouteCollection(this.viewer.entities);
    routes.fromFile("./static/fpf/机场站内漫游.fpf");
    this.flyManager = new Cesium.FlyManager({
      scene: this.viewer.scene,
      routes: routes,
    });
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.clearStationTour();
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", ["SetForceBimData", "SetForceRoomData"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.flyManager.stopArrived.addEventListener(function (routeStop) {
        routeStop.waitTime = 0.4; // 在每个站点处停留1s
      });
      that.flyManager.readyPromise.then(() => {
        that.tourOn = true;
      });
    },
    //  相机移动
    cameraMove() {
      this.stopStationTour();
      window.earth.scene.camera.setView({
        destination: {
          x: -2889836.1221072627,
          y: 4839196.223723019,
          z: 2985417.9096547803,
        },
        orientation: {
          heading: 5.276883674010309,
          pitch: -0.510722024776082,
          roll: 0,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      this.viewer.scene.undergroundMode = true;
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        LAYER_NAME.map((d) => (this.viewer.scene.layers.find(d).visible = true));
      } else {
        const { STATION_SCENE_URL, STATION_DATA_URL } = BimSourceURL;
        const promise = this.viewer.scene.open(STATION_SCENE_URL);
        Cesium.when(promise, async (layers) => {
          LAYER_NAME.map((d, index) => {
            if (index > 2) return undefined;
            const layer = this.viewer.scene.layers.find(d);
            layer.setQueryParameter({
              url: STATION_DATA_URL,
              dataSourceName: d,
              isMerge: true,
            });
            const color = new Cesium.Color.fromCssColorString(
              "rgba(23,92,239,0.3)"
            );
            layer.selectedColor = color;
            layer.datasetInfo().then((result) => {
              this.keys = [...this.keys, ...result.map((v) => v.datasetName)];
              this.StationTreeData[0].children.push({
                id: d,
                label: d,
                children: result.map((v, index) => {
                  return {
                    id: `${d}_${index}`,
                    label: v.datasetName,
                    k: d,
                    startID: v.startID,
                    endID: v.endID,
                  };
                }),
              });
            });
          });
        });
      }
    },
    //  树结构改变
    checkChange(...params) {
      const obj = { 顶板: [], "机场站-B1": [], "机场站-B2": [] };
      const nodes = this.$refs.tree
        .getCheckedNodes()
        .filter((v) => !v.children)
        .map((v) => {
          for (let i = v.startID; i < v.endID + 1; i++) {
            obj[v.k].push(i);
          }
        });
      Object.keys(obj).map((v) => {
        const layer = this.viewer.scene.layers.find(v);
        layer.setObjsVisible(obj[v], true);
      });
    },
    startStationTour() {
      this.flyManager && this.flyManager.play();
    },
    pauseStationTour() {
      this.flyManager && this.flyManager.pause();
    },
    stopStationTour() {
      this.flyManager && this.flyManager.stop();
    },
    closeStationTour() {
      this.clearStationTour();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearStationTour() {
      this.stopStationTour();
      this.flyManager && (this.flyManager = undefined);
      LAYER_NAME.map((d) => (this.viewer.scene.layers.find(d).visible = false));
    },
  },
};
</script>
