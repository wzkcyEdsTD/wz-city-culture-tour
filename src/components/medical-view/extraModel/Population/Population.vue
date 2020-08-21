<template>
  <div class="population"></div>
</template>

<script>
const Cesium = window.Cesium;

export default {
  data() {
    return {
      populationCircleList: {},
      entityCollection: undefined,
    };
  },
  created() {
    this.viewer = window.earth;
  },
  mounted() {
    this.eventRegsiter();
    this.createEntityCollection();
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
     * 创建datesource
     */
    createEntityCollection() {
      const circleEntityCollection = new Cesium.CustomDataSource("medical");
      this.viewer.dataSources.add(circleEntityCollection).then((datasource) => {
        this.entityCollection = circleEntityCollection;
      });
    },
    /**
     * 画缓冲区
     * @param {string!|number!} 没id不画
     * @param {geometry!} 没geometry不画
     * @param {radius?} 单位[米] 先默认 不屌他
     */
    drawPopulationCircle(id, { lng, lat }, raidus = 500) {
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat),
        ellipse: {
          semiMinorAxis: raidus,
          semiMajorAxis: raidus,
          height: 5.0,
          material: Cesium.Color.GREEN.withAlpha(0.5),
        },
        name: id,
      });
      this.populationCircleList[circleEntity.name] = circleEntity;
      this.entityCollection.entities.add(circleEntity);
    },
    /**
     * 删缓冲区
     * @param {string|number|undefined} 有id删id 没id删全部
     */
    removePopulationCircle(id) {
      id
        ? this.entityCollection.entities.removeById(
            this.populationCircleList[id]
          )
        : this.entityCollection.entities.removeAll();
    },
  },
};
</script>

<style lang="less" scoped>
</style>
