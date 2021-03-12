<template>
  <div class="people-area-heat" />
</template>

<script>
const _HEATMAP_INDEX_ = "getui_heatmap_index";
import { getHeatMapByCode } from "api/temporaryAPI";
import { doHeatMap } from "./tools/HeatMap";
export default {
  name: "PeopleAreaHeat",
  data() {
    return {};
  },
  async created() {
    if (window.extraPrimitiveMap[_HEATMAP_INDEX_]) {
      window.extraPrimitiveMap[_HEATMAP_INDEX_].show(true);
    } else {
      const { data } = await getHeatMapByCode();
      this.doAreaHeat(data);
    }
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.resetAreaHeat();
  },
  methods: {
    eventRegsiter() {},
    /**
     * 画热力图
     * @param {array} points 热力图点
     */
    doAreaHeat({ heatmap }) {
      window.extraPrimitiveMap[_HEATMAP_INDEX_] = doHeatMap(heatmap);
    },
    resetAreaHeat() {
      //   window.earth.entities.removeById(
      //     window.extraPrimitiveMap[_HEATMAP_INDEX_]._layer.id
      //   );
      //   delete window.extraPrimitiveMap[_HEATMAP_INDEX_];
      window.extraPrimitiveMap[_HEATMAP_INDEX_].show(false);
    },
  },
};
</script>

<style lang="less" scoped>
.car-line-count {
}
</style>
