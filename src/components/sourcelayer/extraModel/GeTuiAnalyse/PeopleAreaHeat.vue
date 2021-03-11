<template>
  <div class="people-area-heat" />
</template>

<script>
import { getHeatMapByCode } from "api/temporaryAPI";
import { doHeatMap } from "./tools/HeatMap";
export default {
  name: "PeopleAreaHeat",
  data() {
    return {};
  },
  async created() {
    const { data } = await getHeatMapByCode();
    this.doAreaHeat(data);
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
      doHeatMap(heatmap);
    },
    resetAreaHeat() {},
  },
};
</script>

<style lang="less" scoped>
.car-line-count {
}
</style>
