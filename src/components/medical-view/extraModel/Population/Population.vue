<template>
  <div class="population"></div>
</template>

<script>
const Cesium = window.Cesium;

export default {
  data() {
    return {
      populationCircleList: {},
    };
  },
  mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-population-circle");
      this.$bus.$on(
        "cesium-3d-population-circle",
        ({ doDraw, id, geometry }) => {
          !doDraw
            ? removePopulationCircle(id)
            : id && geometry
            ? drawPopulationCircle(id, geometry)
            : undefined;
        }
      );
    },
    /**
     * 画缓冲区
     * @param {string!|number!} 没id不画
     * @param {geometry!} 没geometry不画
     * @param {radius?} 单位[米] 先默认 不屌他
     */
    drawPopulationCircle(id, geometry, raidus = 500) {},
    /**
     * 删缓冲区
     * @param {string|number|undefined} 有id删id 没id删全部
     */
    removePopulationCircle(id) {},
  },
};
</script>

<style lang="less" scoped>
</style>
