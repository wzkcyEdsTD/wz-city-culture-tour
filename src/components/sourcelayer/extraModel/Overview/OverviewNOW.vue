<template>
  <div class="overviewNow">
    <div
      v-for="(item, index) in fixIndexPoints"
      :key="index"
      :id="`cityIndex_${index}`"
      class="cityIndex-popup"
      :style="{
        transform: `translate3d(${item.x || 0}px,${item.y || 0 + 4}px, 0)`,
      }"
    >
      <div class="texts">
        <header>{{ item.label }}</header>
        <p>
          {{ item.value }}
          <i>{{ item.unit }}</i>
        </p>
      </div>
      <div class="imgs">
        <img class="move" src="/static/images/common/cloud_@2x.png" />
        <br />
        <img src="/static/images/common/cloud-line.png" />
      </div>
    </div>
  </div>
</template>

<script>
const LOOT = 28;
import {
  generateCurve,
  CenterPoint,
  LeftPoint,
  RightPoint,
  indexPoints,
  centerPosition,
  dirPosition,
} from "mock/overview.js";
export default {
  name: "overviewNOW",
  data() {
    return {
      CenterPoint,
      LeftPoint,
      RightPoint,
      indexPoints,
      fixIndexPoints: [],
    };
  },
  created() {
    // this.createEntityCollection();
    // this.initLines();
    setTimeout(() => {
      this.initOverview();
    }, 1000);
    this.cameraMove(this.CenterPoint);
    //  开启扫描
    // this.initLineScan();
  },
  mounted() {
    this.eventRegsiter();
  },
  destroyed() {
    // this.removeEntityCollection();
    //  开启鼠标事件
    // this.screenSpaceCameraController(true);
    //  关闭线扫描
    // this.removeLineScan();
    setTimeout(() => {
      this.cameraMove(this.CenterPoint);
    }, 500);
  },
  methods: {
    eventRegsiter() {},
    cameraMove(Point) {
      window.earth.camera.flyTo({ ...Point, duration: 1 });
    },
    initLineScan() {
      window.earth.scene.scanEffect.show = true;
      window.earth.scene.scanEffect.mode = Cesium.ScanEffectMode.LINE;
      window.earth.scene.scanEffect.color = new Cesium.Color.fromCssColorString(
        "rgba(216, 218, 224, 0.8)"
      );
      window.earth.scene.scanEffect.centerPostion = centerPosition;
      let dir = new Cesium.Cartesian3();
      console.log(dirPosition, centerPosition);
      Cesium.Cartesian3.subtract(
        dirPosition,
        window.earth.scene.scanEffect.centerPostion,
        dir
      );
      window.earth.scene.scanEffect.lineWidth = 150;
      window.earth.scene.scanEffect.lineMoveDirection = dir;
      window.earth.scene.scanEffect.speed = 1000;
      window.earth.scene.scanEffect.period = 15.0;
      window.earth.scene.colorCorrection.saturation = 3.9;
      window.earth.scene.colorCorrection.brightness = 0.8;
      window.earth.scene.colorCorrection.contrast = 1.0;
      window.earth.scene.colorCorrection.hue = 0.0;
    },
    removeLineScan() {
      window.earth.scene.scanEffect.show = false;
    },
    createEntityCollection() {
      const cityLineEntityCollection = new Cesium.CustomDataSource("cityLine");
      window.earth.dataSources.add(cityLineEntityCollection);
    },
    removeEntityCollection() {
      window.earth.dataSources.remove(
        window.earth.dataSources.getByName("cityLine")[0]
      );
    },
    initLines() {
      const [p1, p2, p3, p4, p5, p6] = indexPoints.map((v) => {
        return { ...v.geometry, z: 310 };
      });
      this.drawLines(p1, p2, 0);
      this.drawLines(p2, p3, 1);
      this.drawLines(p3, p4, 2);
      this.drawLines(p4, p5, 3);
      this.drawLines(p5, p1, 4);
      this.drawLines(p4, p1, 5);
      this.drawLines(p1, p3, 5);
      this.drawLines(p4, p6, 5);
    },
    drawLines(startPoint, endPoint, index) {
      const datasource = window.earth.dataSources.getByName("cityLine")[0];
      const curLinePointsArr = generateCurve(startPoint, endPoint);
      datasource.entities.add({
        description: "city-line",
        name: `city-line-${index}`,
        polyline: {
          width: 1,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(
            curLinePointsArr
          ),
        },
      });
    },
    doIndexPoints() {
      const fixIndexPoints = [];
      this.indexPoints.map((item, index) => {
        if (!item.geometry.x) return;
        const { x, y } = item.geometry;
        const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          window.earth.scene,
          Cesium.Cartesian3.fromDegrees(x, y, 0)
        );
        pointToWindow &&
          fixIndexPoints.push({
            ...item,
            x: pointToWindow.x - ($(`#cityIndex_${index}`).width() || 0) / 2,
            y: pointToWindow.y - ($(`#cityIndex_${index}`).height() || 0),
          });
      });
      this.fixIndexPoints = fixIndexPoints;
    },
    initOverview() {
      const that = this;
      //  禁用鼠标事件
      // this.screenSpaceCameraController(false);
    },
    screenSpaceCameraController(boolean) {
      window.earth.scene.screenSpaceCameraController.enableInputs = boolean;
      window.earth.scene.screenSpaceCameraController.enableLook = boolean;
      window.earth.scene.screenSpaceCameraController.enableRotate = boolean;
      window.earth.scene.screenSpaceCameraController.enableTilt = boolean;
      window.earth.scene.screenSpaceCameraController.enableTranslate = boolean;
      window.earth.scene.screenSpaceCameraController.enableZoom = boolean;
    },
  },
};
</script>

<style lang="less">
.overviewNow {
  .cityIndex-popup {
    position: absolute;
    text-align: center;
    top: -20px;
    left: 0;
    cursor: pointer;
    .texts {
      background-image: url("/static/images/common/cloud-frame@2x.png");
      background-size: 100% 100%;
      padding: 14px 10px 4px 10px;
      > header {
        color: #2acbfe;
        font-weight: bold;
        font-size: 1.2em;
        text-shadow: 3px 4px 4px #000000;
      }
      > p {
        font-weight: bold;
        font-size: 1.3em;
        color: #fff;
        line-height: 30px;
        text-shadow: 3px 4px 4px #000000;
        > i {
          font-size: 0.8em;
          font-style: normal;
          text-shadow: 3px 4px 4px #000000;
        }
      }
    }
    .imgs {
      text-align: center;
      > img:first-child {
        width: 140px;
      }
      .move {
        animation: heart 1.3s ease-in-out 2.7s infinite alternate;
      }
      @keyframes heart {
        from {
          transform: translate(0, 0);
        }
        to {
          transform: translate(0, 12px);
        }
      }
    }
  }
}
</style>