<template>
  <div class="videoCircle" v-if="shallPop">
    <div
      class="vc-popup"
      :style="{ transform: `translate3d(${item.x}px,${item.y + 4}px, 0)` }"
    >
      <div class="popup-container">
        <div class="remove" @click="removeVideoCircle"></div>
        <div
          :class="['position', rtmpOn ? 'on' : 'off']"
          @click="showVideoCircle"
        ></div>
        <div class="resource" @click="resourceClick"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getRtmpVideoList } from "api/cityBrainAPI";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      shallPop: false,
      geometry: {},
      queryRadius: 200,
      item: {},
      entitiesID: [],
      rtmpOn: true,
    };
  },
  computed: {
    ...mapGetters("map", ["rtmpListOther"]),
  },
  created() {
    if (window._POST_MESSAGE_) {
      this.doDraw();
    }
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetRtmpListOther"]),
    eventRegsiter() {
      const that = this;
      this.$bus.$off("cesium-3d-video-circle");
      this.$bus.$on("cesium-3d-video-circle", (layer) => {
        window._POST_MESSAGE_ && this.doDraw();
      });
    },
    doDraw() {
      const layer = window._POST_MESSAGE_;
      const geometry = {
        lng: layer.geometry[0],
        lat: layer.geometry[1],
      };
      const queryRadius = layer.radius;
      this.removeVideoCircle();
      this.geometry = geometry;
      this.queryRadius = queryRadius;
      this.shallPop = true;
      this.doPopup();
      this.drawVideoCircle(geometry, queryRadius);
      window._POST_MESSAGE_ = undefined;
    },
    doPopup() {
      let position = Cesium.Cartesian3.fromDegrees(
        this.geometry.lng,
        this.geometry.lat,
        0
      );
      let pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        window.earth.scene,
        position
      );
      if (pointToWindow) {
        this.item = {
          x: pointToWindow.x - $(".vc-popup").width() / 2,
          y: pointToWindow.y - $(".vc-popup").height() / 2,
        };
      }
    },
    /**
     * 画缓冲区
     * @param {string!|number!} 没id不画
     * @param {geometry!} 没geometry不画
     * @param {queryRadius!} 监控点查询半径
     */
    async drawVideoCircle({ lng, lat }, queryRadius = 200) {
      setTimeout(() => {
        this.cameraMove({ lng, lat, queryRadius });
      }, 800);
      // 画圈
      console.log("[drawVideoCircle]", lng, lat, queryRadius);
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        ellipse: {
          semiMinorAxis: queryRadius,
          semiMajorAxis: queryRadius,
          height: 12,
          material: Cesium.Color.WHITE.withAlpha(0.1),
          outline: true,
          outlineWidth: 3,
          outlineColor: Cesium.Color.WHITE,
        },
        name: "videoCircle",
      });
      window.earth.entities.add(circleEntity);
      this.entitiesID.push(circleEntity.id);
      const circleLabelEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 200),
        label: {
          text: `周边${queryRadius}米内监控`,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          font: "10px",
          scale: 1,
          outlineWidth: 4,
          showBackground: true,
          backgroundColor: Cesium.Color(0.165, 0.165, 0.165, 0.1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            10000
          ),
          eyeOffset: new Cesium.Cartesian3(0.0, -260.0, 0),
          scaleByDistance: new Cesium.NearFarScalar(5000, 1, 10000, 0.5),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        name: "videoCircleLabel",
      });
      window.earth.entities.add(circleLabelEntity);
      this.entitiesID.push(circleLabelEntity.id);

      // 画监控点
      const { data } = await getRtmpVideoList({ lng, lat }, queryRadius);
      this.SetRtmpListOther(data);
      data.forEach((item) => {
        const videoPointEntity = new Cesium.Entity({
          id: `videopoint_${item.mp_id}`,
          position: Cesium.Cartesian3.fromDegrees(
            Number(item.lng),
            Number(item.lat),
            30
          ),
          billboard: {
            image: "/static/images/map-ico/视频监控.png",
            width: 40,
            height: 40,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          name: item.mp_name,
        });
        window.earth.entities.add(videoPointEntity);
        this.entitiesID.push(videoPointEntity.id);
      });
    },
    /**
     * 相机跳转
     * @param {object} geometry
     */
    cameraMove({ lng, lat, queryRadius }) {
      window.earth.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          lng,
          lat -
            (0.008 + (0.002 * queryRadius * (queryRadius / 200) * 1.1) / 100),
          700 + queryRadius * (queryRadius / 200) * 1.2
        ),
        orientation: {
          heading: 0.003336768850279448,
          pitch: -0.5808830390057418,
          roll: 0.0,
        },
      });
    },
    /**
     * 删缓冲区
     * @param {string|number|undefined} 有id删id 没id删全部
     */
    removeVideoCircle() {
      this.entitiesID.forEach((item) => {
        window.earth.entities.removeById(item);
      });
      this.shallPop = false;
      this.entitiesID = [];
    },
    /**
     * 显隐视频点
     */
    showVideoCircle() {
      const now_rtmpOn = !this.rtmpOn;
      this.entitiesID.forEach((item, index) => {
        index != 0 && (window.earth.entities.getById(item).show = now_rtmpOn);
      });
      this.rtmpOn = now_rtmpOn;
    },
    resourceClick() {
      this.$bus.$emit("cesium-3d-videoPointClick", {
        mp_id: `videopoint_${this.rtmpListOther[0].mp_id}`,
        mp_name: this.rtmpListOther[0].mp_name,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.vc-popup {
  position: absolute;
  text-align: center;
  top: -20px;
  left: 0;
  z-index: 2;
  cursor: pointer;
  .popup-container {
    display: flex;
    align-items: center;
    .remove,
    .resource {
      width: 50px;
      height: 101px;
      // font-family: YouSheBiaoTiHei;
      // font-size: 14px;
      // color: #fff;
      // writing-mode: vertical-lr;
    }
    .remove {
      .bg-image("/static/images/common/VC-remove-bg");
    }
    .position {
      width: 30px;
      height: 30px;
      &.on {
        .bg-image("/static/images/common/my-position-on");
      }
      &.off {
        .bg-image("/static/images/common/my-position-off");
      }
    }
    .resource {
      .bg-image("/static/images/common/VC-show-bg");
    }
  }
}
</style>
