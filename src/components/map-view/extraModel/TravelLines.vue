<template>
  <div class="TravelLines"></div>
</template>

<script>
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
import PolylineTrailLinkMaterialProperty from "./TravelLines";

export default {
  data() {
    return {
      viewer: undefined,
    };
  },
  created() {
    this.viewer = window.earth;
  },
  async mounted() {
    this.addEntities();
    this.eventRegsiter();
    this.cameraMove();
    // this.SetIsInfoFrame(true);
  },
  beforeDestroy() {
    this.viewer.entities.removeAll();
    // this.SetIsInfoFrame(false);
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", ["SetIsInfoFrame"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
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
    //  初始化路线
    addEntities() {
      console.log("addEntities");
      let points = [
        {
          x: 120.70002497229238,
          y: 28.00924299663466,
        },
        {
          x: 120.70016953457684,
          y: 28.002895673631237,
        },
        {
          x: 120.6982307176173,
          y: 27.994187416355338,
        },
        {
          x: 120.69475177895151,
          y: 27.98618703177324,
        },
      ];
      let linePoints = [
        120.70002497229238,
        28.00924299663466,
        120.70016953457684,
        28.002895673631237,
        120.6982307176173,
        27.994187416355338,
        120.69475177895151,
        27.98618703177324,
      ];
      points.forEach((item) => {
        this.drawPoint(item);
      });
      this.drawPolyline(linePoints);
    },

    drawPoint(point) {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(point.x, point.y, 40),
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 10,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 3,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        name: "travel",
      });
    },

    drawPolyline(linePoints) {
      this.viewer.entities.add({
        name: "polyline",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(linePoints),
          width: 8,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.YELLOW,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK,
          }),
          clampToGround: true,
          material: new Cesium.PolylineTrailLinkMaterialProperty(
            Cesium.Color.WHITE,
            3000,
            1
          ),
        },
      });
    },
  },
};
</script>

<style>
</style>
