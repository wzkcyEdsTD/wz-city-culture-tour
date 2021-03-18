<template>
  <div class="people-area-heat">
    <GetGeohashByGeometry
      :BUS_EVENT_TAG="BUS_EVENT_TAG_GRID_DRAW"
      :isLoading="isGridDrawLoading"
    />
    <GetGeohashByCodeForGrid
      ref="codeForGrid"
      :BUS_EVENT_TAG="BUS_EVENT_TAG_GRID_CODE"
      :isLoading="isGridCodeLoading"
    />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
const LAYERS = ServiceUrl.WZBaimo_OBJ;
const _GRIDMAP_INDEX_ = "getui_gridmap_index";
const _GRIDLABEL_INDEX_ = "getui_gridlabel_index";
import { getHeatMapByCode } from "api/getuiAPI";
import { doGridMap, doGridLabel } from "./tools/GridMap";
import GetGeohashByCodeForGrid from "./components/GetGeohashByCodeForGrid";
import GetGeohashByGeometry from "./components/GetGeohashByGeometry";
const BUS_EVENT_TAG_GRID_CODE = "cesium-getui-area-grid-code";
const BUS_EVENT_TAG_GRID_DRAW = "cesium-getui-area-grid-draw";
const BUS_EVENT_TAG_CLICK = "cesium-getui-area-grid-click";
export default {
  name: "PeopleAreaGrid",
  data() {
    return {
      BUS_EVENT_TAG_GRID_CODE,
      BUS_EVENT_TAG_GRID_DRAW,
      isGridCodeLoading: false,
      isGridDrawLoading: false,
    };
  },
  components: { GetGeohashByCodeForGrid, GetGeohashByGeometry },
  created() {
    this.initS3MScene();
  },
  async mounted() {
    this.eventRegsiter();
    await this.initGridMap(this.$refs.codeForGrid.areaCode);
  },
  beforeDestroy() {
    this.resetAreaGrid();
    this.resetS3MScene();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off(BUS_EVENT_TAG_GRID_CODE);
      this.$bus.$on(BUS_EVENT_TAG_GRID_CODE, (code) => this.initGridMap(code));
      this.$bus.$off(BUS_EVENT_TAG_CLICK);
      this.$bus.$on(BUS_EVENT_TAG_CLICK, (obj) => {
        this.doLabelGrid(obj);
      });
    },
    initS3MScene() {
      LAYERS.map(({ KEY }) => {
        window.earth.scene.layers.find(KEY).visible = false;
      });
    },
    async initGridMap(code) {
      this.resetAreaGrid();
      try {
        this.isGridCodeLoading = true;
        const { data } = await getHeatMapByCode(code);
        this.doCameraMove(data.heatmap[parseInt(data.heatmap.length / 2)]);
        this.doAreaGrid(data);
      } catch (e) {
      } finally {
        this.isGridCodeLoading = false;
      }
    },
    /**
     * 画热力图
     * @param {array} points 热力图点
     */
    doAreaGrid({ heatmap }) {
      doGridMap(heatmap, _GRIDMAP_INDEX_, BUS_EVENT_TAG_CLICK);
    },
    /**
     * 展示标签
     */
    doLabelGrid(obj) {
      doGridLabel(obj, _GRIDLABEL_INDEX_);
    },
    /**
     * @param {object} 中间点位
     */
    doCameraMove({ lng, lat }) {
      window.earth.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat - 0.08, 5200),
        orientation: {
          heading: 0.003336768850279448,
          pitch: -0.5808830390057418,
          roll: 0.0,
        },
        maximumHeight: 450,
      });
    },
    //  清除图层
    resetAreaGrid() {
      if (window.extraPrimitiveMap[_GRIDMAP_INDEX_]) {
        window.extraPrimitiveMap[_GRIDMAP_INDEX_].removeAll();
        window.extraPrimitiveMap[_GRIDLABEL_INDEX_].removeAll();
        delete window.extraPrimitiveMap[_GRIDMAP_INDEX_];
        delete window.extraPrimitiveMap[_GRIDLABEL_INDEX_];
      }
    },
    resetS3MScene() {
      LAYERS.map(({ KEY }) => {
        window.earth.scene.layers.find(KEY).visible = true;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.people-area-heat {
  position: fixed;
  top: 20vh;
  right: 4vh;
  z-index: 2;
}
</style>
