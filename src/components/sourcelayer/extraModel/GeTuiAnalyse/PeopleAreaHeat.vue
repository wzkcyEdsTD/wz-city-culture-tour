<template>
  <div class="people-area-heat">
    <GetGeohashByGeometry
      :BUS_EVENT_TAG="BUS_EVENT_TAG_HEAT_DRAW"
      :isLoading="isHeatDrawLoading"
    />
    <GetGeohashByCode
      :BUS_EVENT_TAG="BUS_EVENT_TAG_HEAT_CODE"
      :isLoading="isHeatCodeLoading"
    />
  </div>
</template>

<script>
const _HEATMAP_INDEX_ = "getui_heatmap_index";
import { getHeatMapByCode, getHeatMapByGeometry } from "api/getuiAPI";
import { doHeatMap } from "./tools/HeatMap";
import GetGeohashByCode from "./components/GetGeohashByCode";
import GetGeohashByGeometry from "./components/GetGeohashByGeometry";
const BUS_EVENT_TAG_HEAT_CODE = "cesium-getui-area-heat-code";
const BUS_EVENT_TAG_HEAT_DRAW = "cesium-getui-area-heat-draw";
export default {
  name: "PeopleAreaHeat",
  data() {
    return {
      BUS_EVENT_TAG_HEAT_CODE,
      BUS_EVENT_TAG_HEAT_DRAW,
      isHeatCodeLoading: false,
      isHeatDrawLoading: false,
    };
  },
  components: { GetGeohashByCode, GetGeohashByGeometry },
  async created() {
    await this.initHeatMap();
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.resetAreaHeat();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off(BUS_EVENT_TAG_HEAT_CODE);
      this.$bus.$on(BUS_EVENT_TAG_HEAT_CODE, (code) => this.initHeatMap(code));
      this.$bus.$off(BUS_EVENT_TAG_HEAT_DRAW);
      this.$bus.$on(BUS_EVENT_TAG_HEAT_DRAW, (ranges) =>
        this.initHeatMapByGeometry(ranges)
      );
    },
    async initHeatMap(code) {
      this.resetAreaHeat();
      try {
        this.isHeatCodeLoading = true;
        const { data } = await getHeatMapByCode(code);
        this.doCameraMove(data.heatmap[parseInt(data.heatmap.length / 2)]);
        this.doAreaHeat(data);
      } catch (e) {
      } finally {
        this.isHeatCodeLoading = false;
      }
    },
    async initHeatMapByGeometry(ranges) {
      this.resetAreaHeat();
      try {
        this.isHeatDrawLoading = true;
        const { data } = await getHeatMapByGeometry(ranges);
        this.doCameraMove(data.heatmap[parseInt(data.heatmap.length / 2)]);
        this.doAreaHeat(data);
      } catch (e) {
      } finally {
        this.isHeatDrawLoading = false;
      }
    },
    /**
     * 画热力图
     * @param {array} points 热力图点
     */
    doAreaHeat({ heatmap }) {
      window.extraPrimitiveMap[_HEATMAP_INDEX_] = doHeatMap(heatmap);
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
    resetAreaHeat() {
      if (window.extraPrimitiveMap[_HEATMAP_INDEX_]) {
        window.earth.entities.removeById(
          window.extraPrimitiveMap[_HEATMAP_INDEX_]._layer.id
        );
        delete window.extraPrimitiveMap[_HEATMAP_INDEX_];
      }
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
