<!--
 * @Author: eds
 * @Date: 2020-08-21 18:30:30
 * @LastEditTime: 2020-08-22 15:41:33
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\extraModel\Population\Population.vue
-->
<template>
  <div class="population"></div>
</template>

<script>
import { getAccessToken, getPopulation } from "api/fetch";
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
    async drawPopulationCircle(id, { lng, lat }, raidus = 500) {
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat),
        ellipse: {
          semiMinorAxis: raidus,
          semiMajorAxis: raidus,
          height: 4,
          material: Cesium.Color.WHITE.withAlpha(0.2),
          outline: true,
          outlineWidth: 2,
          outlineColor: Cesium.Color.WHITE,
        },
        name: id,
      });
      const accessToken = await getAccessToken();
      const result = await getPopulation(
        { lng, lat },
        accessToken.data.access_token
      );
      circleEntity.label = {
        text: `时间:${result.task_time}\n人数:${result.data}人`,
        color: Cesium.Color.fromCssColorString("#fff"),
        font: "normal 18px MicroSoft YaHei",
        // verticalOrigin: Cesium.VerticalOrigin.TOP,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
        eyeOffset: new Cesium.Cartesian3(0.0, -170.0, -10),
        scaleByDistance: new Cesium.NearFarScalar(5000, 1, 10000, 0.5),
      };
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
            this.populationCircleList[id].id
          )
        : this.entityCollection.entities.removeAll();
    },
  },
};
</script>

<style lang="less" scoped>
</style>
