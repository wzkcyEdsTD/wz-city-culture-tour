<template>
  <div class="videoCircle" v-if="shallPop">
    <div
      class="vc-popup"
      :style="{transform:`translate3d(${item.x}px,${item.y+4}px, 0)`}"
    >
      <div class="popup-container">
        <div class="remove" @click="removeVideoCircle(null)"></div>
        <div class="position"></div>
        <div class="resource" @click="resourceClick()"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getRtmpVideoList } from "api/fetch";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      shallPop: false,
      videoCircleList: {},
      videoCircleLabelList: {},
      videoCircleCollection: undefined,
      videoCircleLabelCollection: undefined,
      videoPointCollection: undefined,
      geometry: {},
      queryRadius: '',
      item: {},
      rtmpVideoList: []
    };
  },
  mounted() {
    this.eventRegsiter();
    this.createEntityCollection();
  },
  methods: {
    ...mapActions("map", ["SetRtmpList"]),
    eventRegsiter() {
      const that = this;
      this.$bus.$off("cesium-3d-video-circle");
      this.$bus.$on(
        "cesium-3d-video-circle",
        ({ geometry, queryRadius }) => {
          console.log('cesium-3d-video-circle')
          this.geometry = geometry
          this.queryRadius = queryRadius
          this.doPopup()
          this.drawVideoCircle(geometry, queryRadius)
        }
      );
    },
    doPopup() {
      let position = Cesium.Cartesian3.fromDegrees(this.geometry.lng, this.geometry.lat, 0)
      let pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        window.earth.scene,
        position
      );
      this.item = {
        x:
          pointToWindow.x -
          $('.vc-popup').width() / 2,
        y:
          pointToWindow.y -
          $('.vc-popup').height(),
      }
      !this.shallPop &&
      this.$nextTick(() => {
        this.shallPop = true;
      });
    },
    /**
     * 创建datesource
     */
    createEntityCollection() {
      const VideoCircleEntityCollection = new Cesium.CustomDataSource(
        "VideoCircle"
      );
      const VideoCircleLabelEntityCollection = new Cesium.CustomDataSource(
        "VideoCircleLabel"
      );
      const VideoPointEntityCollection = new Cesium.CustomDataSource(
        "VideoPoint"
      );
      window.earth.dataSources
        .add(VideoCircleEntityCollection)
        .then((datasource) => {
          this.videoCircleCollection = VideoCircleEntityCollection;
        });
      window.earth.dataSources
        .add(VideoCircleLabelEntityCollection)
        .then((datasource) => {
          this.videoCircleLabelCollection = VideoCircleLabelEntityCollection;
        });
      window.earth.dataSources
        .add(VideoPointEntityCollection)
        .then((datasource) => {
          this.videoPointCollection = VideoPointEntityCollection;
      });
      window.earth.scene.globe.depthTestAgainstTerrain = false;
    },
    /**
     * 画缓冲区
     * @param {string!|number!} 没id不画
     * @param {geometry!} 没geometry不画
     * @param {queryRadius!} 监控点查询半径
     * @param {circleRadius?} 单位[米] 先默认 不屌他
     */
    async drawVideoCircle({ lng, lat }, queryRadius, circleRadius = 500) {
      // 画圈
      console.log('drawVideoCircle', lng, lat, queryRadius)
      const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        ellipse: {
          semiMinorAxis: queryRadius*2,
          semiMajorAxis: queryRadius*2,
          height: 4,
          material: Cesium.Color.YELLOW.withAlpha(0.2),
          outline: true,
          outlineWidth: 3,
          outlineColor: Cesium.Color.YELLOW,
        },
        name: 'videoCircle',
      });
      this.videoCircleCollection.entities.add(circleEntity);
      this.videoCircleList[circleEntity.name] = circleEntity;
      
      const circleLabelEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 200),
        label: {
          text: `周边${queryRadius}米内监控`,
          color: Cesium.Color.fromCssColorString("#fff"),
          font: "bold 12px MicroSoft YaHei",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            10000
          ),
          eyeOffset: new Cesium.Cartesian3(0.0, -260.0, 0),
          scaleByDistance: new Cesium.NearFarScalar(5000, 1, 10000, 0.5),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        name: 'videoCircleLabel',
      });
      this.videoCircleLabelCollection.entities.add(circleLabelEntity);
      this.videoCircleLabelList[circleLabelEntity.name] = circleLabelEntity;

      // 画监控点
      const { data } = await getRtmpVideoList(
        {lng, lat},
        queryRadius,
      );
      this.rtmpVideoList = data
      data.forEach((item) => {
        this.videoPointCollection.entities.add(
          new Cesium.Entity({
            id: `videopoint_${item.mp_id}`,
            position: Cesium.Cartesian3.fromDegrees(
              Number(item.lng),
              Number(item.lat),
              30
            ),
            billboard: {
              image: '/static/images/视频监控.png',
              width: 37,
              height: 41,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            name: item.mp_name,
          })
        );
      })

      window.earth.zoomTo(circleEntity);
    },

    doSetRtmpList() {
      this.SetRtmpList(this.rtmpVideoList);
    },

    /**
     * 删缓冲区
     * @param {string|number|undefined} 有id删id 没id删全部
     */
    removeVideoCircle(id) {
      id
        ? this.videoCircleCollection.entities.removeById(
            this.videoCircleList[id].id
          )
        : this.videoCircleCollection.entities.removeAll();
      id
        ? this.videoCircleLabelCollection.entities.removeById(
            this.videoCircleLabelList[id].id
          )
        : this.videoCircleLabelCollection.entities.removeAll();
      this.videoPointCollection.entities.removeAll();
      this.shallPop = false
    },

    resourceClick() {
      this.doSetRtmpList()
      this.$bus.$emit("cesium-3d-videoPointClick", {
        mp_id: `videopoint_${this.rtmpVideoList[0].mp_id}`,
        mp_name: this.rtmpVideoList[0].mp_name,
      });
    }
  },
};
</script>

<style lang="less" scoped>
.vc-popup {
  position: absolute;
  text-align: center;
  top: -20px;
  left: 0;
  z-index: 99999;
  cursor: pointer;
  .popup-container {
    display: flex;
    align-items: center;
    .remove, .resource {
      width: 36px;
      height: 73px;
      // font-family: YouSheBiaoTiHei;
      // font-size: 14px;
      // color: #fff;
      // writing-mode: vertical-lr;
    }
    .remove {
      .bg-image("../../../common/images/VC-remove-bg");
    }
    .position {
      width: 30px;
      height: 30px;
      .bg-image("../../../common/images/my-position");
    }
    .resource {
      .bg-image("../../../common/images/VC-show-bg");
    }
  }
}
</style>
