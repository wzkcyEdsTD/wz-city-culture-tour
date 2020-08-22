<!--
 * @Author: eds
 * @Date: 2020-08-21 18:30:30
 * @LastEditTime: 2020-08-22 20:52:08
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
      populationCircleLabelList: {},
      medicalCircleCollection: undefined,
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
      const MedicalCircleEntityCollection = new Cesium.CustomDataSource(
        "medical"
      );
      const MedicalCircleLabelEntityCollection = new Cesium.CustomDataSource(
        "medical_label"
      );
      this.viewer.dataSources
        .add(MedicalCircleEntityCollection)
        .then((datasource) => {
          this.medicalCircleCollection = MedicalCircleEntityCollection;
        });
      this.viewer.dataSources
        .add(MedicalCircleLabelEntityCollection)
        .then((datasource) => {
          this.medicalCircleLabelCollection = MedicalCircleLabelEntityCollection;
        });
      this.viewer.scene.globe.depthTestAgainstTerrain = false;
    },
    async drawPopulationScan(
      doScan,
      id,
      { lng, lat } = {},
      radius = 500,
      period = 2.0
    ) {
      if (!doScan) return (this.viewer.scene.scanEffect.show = false);
      this.viewer.scene.scanEffect.show = true; //开启扫描效果
      this.viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.CIRCLE; //利用圆环扫描效果
      this.viewer.scene.scanEffect.centerPostion = new Cesium.Cartesian3.fromDegrees(
        lng,
        lat,
        30
      );
      this.viewer.scene.scanEffect.speed = radius / period;
      this.viewer.scene.scanEffect.period = 2.0;
      this.viewer.scene.scanEffect.color = Cesium.Color.WHITE;

      this.viewer.scene.colorCorrection.saturation = 3.9;
      this.viewer.scene.colorCorrection.brightness = 0.8;
      this.viewer.scene.colorCorrection.contrast = 1.0;
      this.viewer.scene.colorCorrection.hue = 0.0;
    },
    /**
     * 画缓冲区
     * @param {string!|number!} 没id不画
     * @param {geometry!} 没geometry不画
     * @param {radius?} 单位[米] 先默认 不屌他
     */
    async drawPopulationCircle(id, { lng, lat }, raidus = 500) {
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        ellipse: {
          semiMinorAxis: raidus,
          semiMajorAxis: raidus,
          height: 4,
          material: Cesium.Color.WHITE.withAlpha(0.2),
          outline: true,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE,
        },
        name: id,
      });
      this.medicalCircleCollection.entities.add(circleEntity);
      this.populationCircleList[circleEntity.name] = circleEntity;
      const accessToken = await getAccessToken();
      const result = await getPopulation(
        { lng, lat },
        accessToken.data.access_token
      );
      const circleLabelEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 200),
        label: {
          text: `周边500米实施人口\n时间:${result.task_time}\n人数:${result.data}人`,
          color: Cesium.Color.fromCssColorString("#fff"),
          font: "normal 16px MicroSoft YaHei",
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            10000
          ),
          eyeOffset: new Cesium.Cartesian3(0.0, -160.0, 0),
          scaleByDistance: new Cesium.NearFarScalar(5000, 1, 10000, 0.5),
        },
        name: id,
      });
      this.populationCircleLabelList[
        circleLabelEntity.name
      ] = circleLabelEntity;
      this.medicalCircleLabelCollection.entities.add(circleLabelEntity);
      this.drawPopulationScan(true, id, { lng, lat });
    },
    /**
     * 删缓冲区
     * @param {string|number|undefined} 有id删id 没id删全部
     */
    removePopulationCircle(id) {
      id
        ? this.medicalCircleCollection.entities.removeById(
            this.populationCircleList[id].id
          )
        : this.medicalCircleCollection.entities.removeAll();
      id
        ? this.medicalCircleLabelCollection.entities.removeById(
            this.populationCircleLabelList[id].id
          )
        : this.medicalCircleLabelCollection.entities.removeAll();

      this.drawPopulationScan(false);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
