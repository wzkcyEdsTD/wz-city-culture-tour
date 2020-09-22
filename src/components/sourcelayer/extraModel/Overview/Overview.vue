<template>
  <div class="overview" v-show="$parent.isOverview">
    <div
      v-for="(item, index) in fixIndexPoints"
      :key="index"
      :id="`cityIndex_${index}`"
      class="cityIndex-popup"
      :style="{transform:`translate3d(${item.x || 0}px,${item.y ||0+4}px, 0)`}"
    >
      <div class="texts">
        <header>{{item.label}}</header>
        <p>
          {{item.value}}
          <i>{{item.unit}}</i>
        </p>
      </div>
      <div class="imgs">
        <img src="/static/images/common/cloud@2x.png" />
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
  xs,
  ys,
  zs,
  headings,
  pitchs,
  indexPoints,
} from "./Overview";
export default {
  name: "overview",
  data() {
    return {
      cameraTimer: undefined,
      toRight: true,
      CenterPoint,
      LeftPoint,
      RightPoint,
      indexPoints,
      fixIndexPoints: [],
    };
  },
  mounted() {
    this.eventRegsiter();
    // this.createEntityCollection();
    // this.initLines();
    this.cameraMove(this.CenterPoint);
    setTimeout(() => {
      this.initOverview();
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.cameraTimer);
    // this.removeEntityCollection();
    //  开启鼠标事件
    this.screenSpaceCameraController(true);
    this.cameraMove(this.CenterPoint);
  },
  methods: {
    eventRegsiter() {},
    cameraMove(Point) {
      window.earth.camera.flyTo({ ...Point, duration: 2 });
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
      this.fixIndexPoints = this.indexPoints.map((item, index) => {
        if (!item.geometry.x) return;
        const { x, y } = item.geometry;
        const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          window.earth.scene,
          Cesium.Cartesian3.fromDegrees(x, y, 0)
        );
        return {
          ...item,
          x: pointToWindow.x - ($(`#cityIndex_${index}`).width() || 0) / 2,
          y: pointToWindow.y - ($(`#cityIndex_${index}`).height() || 0),
        };
      });
    },
    cameraFlyTo() {
      const toPoint = this.toRight ? this.RightPoint : this.LeftPoint;
      window.earth.camera.flyTo({ ...toPoint, duration: LOOT });
      this.toRight = !this.toRight;
    },
    initOverview() {
      const that = this;
      //  禁用鼠标事件
      this.screenSpaceCameraController(false);
      //  开启
      this.cameraFlyTo();
      this.cameraTimer = setInterval(() => {
        this.cameraFlyTo();
      }, (LOOT - 1) * 1000);
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
.overview {
  .cityIndex-popup {
    position: absolute;
    text-align: center;
    top: -20px;
    left: 0;
    cursor: pointer;
    .texts {
      background-image: url("/static/images/common/cloud-frame@2x.png");
      background-size: 100% 100%;
      padding: 10px 10px 4px 10px;
      > header {
        color: #2acbfe;
        font-weight: bold;
        text-shadow: 3px 4px 4px #000000;
      }
      > p {
        font-weight: bold;
        font-size: 1em;
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
        width: 120px;
      }
    }
  }
}
</style>