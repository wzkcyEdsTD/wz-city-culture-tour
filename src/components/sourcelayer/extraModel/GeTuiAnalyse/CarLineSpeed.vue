<template>
  <div class="car-line-count" />
</template>

<script>
import { getRoadsData } from "api/getuiAPI";
import { doCountRoute, doRoadLabel } from "./tools/GridCsRoad";
const _GRIDROAD_INDEX_ = "getui_gridroad_index";
const _GRIDROADLABEL_INDEX_ = "getui_gridroadlabel_index";
const BUS_EVENT_TAG_ROAD_CLICK = "cesium-getui-area-road-click";

export default {
  name: "CarLineCount",
  data() {
    return {
      roadIds: [],
    };
  },
  async created() {
    const { data } = await getRoadsData();
    this.roadIds = doCountRoute(
      data,
      _GRIDROAD_INDEX_,
      BUS_EVENT_TAG_ROAD_CLICK
    );
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.resetRoads();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off(BUS_EVENT_TAG_ROAD_CLICK);
      this.$bus.$on(BUS_EVENT_TAG_ROAD_CLICK, (obj) => {
        this.doLabelRoad(obj);
      });
    },
    doLabelRoad(obj) {
      doRoadLabel(obj, _GRIDROADLABEL_INDEX_);
    },
    resetRoads() {
      this.roadIds.map((v) => window.earth.entities.removeById(v));
      this.roadIds = [];
      if (window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_]) {
        window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_].removeAll();
        delete window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.car-line-count {
}
</style>
