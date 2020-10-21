<!--
 * @Author: eds
 * @Date: 2020-09-10 10:16:26
 * @LastEditTime: 2020-09-14 15:31:21
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\extraModel\PolylineTrailLink\RoadLine.vue
-->
<template>
  <div class="TravelLines"></div>
</template>

<script>
const Cesium = window.Cesium;
import PolylineTrailLinkMaterialProperty from "./PolylineTrailLink";
import lines from "mock/Routes_data_YJ_FeaturesToJSO.json";
import walls from "mock/XZQH_LuCheng_FeaturesTo.json";
export default {
  data() {
    return {
      viewer: undefined,
    };
  },
  async mounted() {
    this.eventRegsiter();
    // this.drawWall();
    this.addDynamicLine();
    // this.addHaloLine();
    this.changeSkyBox("night");
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      window.defaultSkyBox = window.earth.scene.skyBox;
      this.$bus.$on("cesium-3d-switch", ({ value }) => {
        const _LAYER_ = window.earth.scene.layers.find("baimo");
        this.changeSkyBox(!value ? "day" : "night");
      });
    },
    /**
     * 切换天空盒子
     * @param {string} boxType day night
     */
    changeSkyBox(boxType) {
      window.earth.scene.skyBox =
        boxType == "day"
          ? new Cesium.SkyBox({
              sources: {
                positiveX: "/static/images/skyBox/day/posx.png",
                negativeX: "/static/images/skyBox/day/negx.png",
                positiveY: "/static/images/skyBox/day/posy1.png",
                negativeY: "/static/images/skyBox/day/negy1.png",
                positiveZ: "/static/images/skyBox/day/negz1.png",
                negativeZ: "/static/images/skyBox/day/posz1.png",
              },
            })
          : window.defaultSkyBox;
    },
    //  相机移动
    cameraMove() {
      window.earth.scene.camera.setView({
        destination: {
          x: -2876284.3979956135,
          y: 4845208.573054629,
          z: 2992762.234962943,
        },
        orientation: {
          heading: 0.0030737118735766344,
          pitch: -0.582106282953041,
          roll: 0,
        },
      });
    },
    addHaloLine() {
      const promiseroute_level1 = Cesium.GeoJsonDataSource.load(
        "/static/json/Routes_data_YJ_FeaturesToJSO.json"
      );
      promiseroute_level1
        .then((dataSource) => {
          window.earth.dataSources.add(dataSource);
          const Routes_level1 = dataSource.entities.values;
          for (var i = 0; i < Routes_level1.length; i++) {
            var line = Routes_level1[i];
            line.polyline.material = new Cesium.PolylineGlowMaterialProperty({
              //设置Glow材质
              glowPower: 0.06,
              color: Cesium.Color.ORANGERED.withAlpha(0.9),
            });
            line.polyline.width = 20;
          }
        })
        .otherwise((error) => console.log(error));
      const promiseroute_level2 = Cesium.GeoJsonDataSource.load(
        "/static/json/Routes_data_EJ_FeaturesToJSO.json"
      );
      promiseroute_level2
        .then((dataSource) => {
          window.earth.dataSources.add(dataSource);
          const Routes_level2 = dataSource.entities.values;
          for (var i = 0; i < Routes_level2.length; i++) {
            var line = Routes_level2[i];
            line.polyline.material = new Cesium.PolylineGlowMaterialProperty({
              //设置Glow材质
              glowPower: 0.04,
              color: Cesium.Color.ORANGERED.withAlpha(0.9),
            });
            line.polyline.width = 10;
          }
        })
        .otherwise((error) => console.log(error));
    },
    //  初始化路线
    addDynamicLine() {
      const linePoints = lines.geometries.map((v) =>
        v.coordinates.map((d) => [...d, 10])
      );
      linePoints.map((v, index) =>
        this.drawPolyline(
          v.reduce((a, b) => a.concat(b)),
          index
        )
      );
    },
    drawPolyline(linePoints) {
      window.earth.entities.add({
        name: "PolylineTrail",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(linePoints),
          width: 16,
          material: new Cesium.PolylineTrailLinkMaterialProperty(
            Cesium.Color.WHITE,
            10000
          ),
        },
      });
    },
    drawWall() {
      let alp = 1,
        num = 0;
      window.earth.entities.add({
        name: "wall",
        wall: {
          show: true,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(
            walls.features[0].geometry.rings[0]
              .map((v) => [...v, 100])
              .reduce((a, b) => a.concat(b))
          ),
          material: new Cesium.ImageMaterialProperty({
            image: "/static/images/area/1.png",
            transparent: true,
            color: new Cesium.CallbackProperty(() => {
              num % 2 === 0 ? (alp -= 0.06) : (alp += 0.06);
              alp <= 0.3 || alp >= 1 ? num++ : undefined;
              return Cesium.Color.WHITE.withAlpha(alp);
            }, false),
          }),
        },
      });
    },
  },
};
</script>

<style>
</style>
