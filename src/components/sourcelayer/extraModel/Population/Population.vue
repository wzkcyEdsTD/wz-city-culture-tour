<!--
 * @Author: eds
 * @Date: 2020-08-21 18:30:30
 * @LastEditTime: 2020-09-03 14:07:34
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\extraModel\Population\Population.vue
-->
<template>
  <div class="population"></div>
</template>

<script>
import { getPopulation } from "api/cityBrainAPI";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      populationCircleList: [],
    };
  },
  mounted() {
    this.eventRegsiter();
    this.createEntityCollection();
  },
  methods: {
    eventRegsiter() {
      const that = this;
      this.$bus.$off("cesium-3d-population-circle");
      this.$bus.$on(
        "cesium-3d-population-circle",
        ({ doDraw, id, geometry }) => {
          !doDraw
            ? that.removePopulationCircle(id)
            : id && geometry
            ? that.drawPopulationCircle(id, geometry)
            : undefined;
        }
      );
    },
    /**
     * 创建datesource
     */
    createEntityCollection() {
      const MedicalCircleEntityCollection = new Cesium.CustomDataSource(
        "medical"
      );
      window.earth.dataSources.add(MedicalCircleEntityCollection);
    },
    /**
     * 开启扫描
     */
    async drawPopulationScan(
      doScan,
      id,
      { lng, lat } = {},
      radius = 500,
      period = 3.0
    ) {
      if (!doScan) return (window.earth.scene.scanEffect.show = false);
      window.earth.scene.scanEffect.show = true;
      window.earth.scene.scanEffect.color = Cesium.Color.fromCssColorString(
        "rgba(255,255,255,0.3)"
      );
      window.earth.scene.scanEffect.mode = Cesium.ScanEffectMode.CIRCLE;
      window.earth.scene.scanEffect.centerPostion = new Cesium.Cartesian3.fromDegrees(
        lng,
        lat,
        20
      );
      window.earth.scene.scanEffect.speed = radius / period;
      window.earth.scene.scanEffect.period = period;
    },
    /**
     * 画缓冲区
     * @param {string!|number!} 没id不画
     * @param {geometry!} 没geometry不画
     * @param {radius?} 单位[米] 先默认 不屌他
     */
    async drawPopulationCircle(id, { lng, lat }, raidus = 500) {
      console.log("[drawPopulationCircle]", lng, lat);
      const datasource = window.earth.dataSources.getByName("medical")[0];
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        ellipse: {
          semiMinorAxis: raidus,
          semiMajorAxis: raidus,
          height: 10,
          material: Cesium.Color.WHITE.withAlpha(0.2),
          outline: true,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE,
        },
        id,
      });
      datasource.entities.add(circleEntity);
      const result = await getPopulation({ lng, lat });
      this.drawPopulationScan(true, id, { lng, lat });
      this.$bus.$emit("cesium-3d-around-people", { id, result });
    },
    /**
     * 删缓冲区
     * @param {string|number|undefined} 有id删id 没id删全部
     */
    removePopulationCircle(id) {
      const datasource = window.earth.dataSources.getByName("medical")[0];
      id ? datasource.entities.removeById(id) : datasource.entities.removeAll();
      this.drawPopulationScan(false);
    },
  },
};
</script>

<style lang="less" scoped></style>
