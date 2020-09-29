<template>
  <div class="common_chart" :id="chartId" />
</template>

<script>
import echarts from "echarts";
export default {
  name: "chartframe",
  props: ["option", "chartId"],
  watch: {
    option(n) {
      this.chart.setOption(value, true);
    },
  },
  mounted() {
    this.option && this.initChart();
  },
  methods: {
    //    initMap Promise<Boolean>
    initChart() {
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.chart.setOption(this.option, true);
    },
  },
};
</script>

<style scoped lang="less">
.common_chart {
  flex: 1;
}
</style>