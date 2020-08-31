<template>
  <div class="videoCircle"></div>
</template>

<script>
import { mapActions } from "vuex";
import { getRtmpVideoList } from "api/fetch";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      videoCircleList: {},
      videoCircleLabelList: {},
      videoCircleCollection: undefined,
      videoCircleLabelCollection: undefined,
      videoPointCollection: undefined,
      handler: undefined,
    };
  },
  created() {
    this.handler = new Cesium.ScreenSpaceEventHandler(window.earth.scene.canvas);
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
        ({ doDraw, id, geometry, queryRadius }) => {
          console.log('cesium-3d-video-circle')
          !doDraw
            ? that.removeVideoCircle(id)
            : id && geometry
            ? that.drawVideoCircle(id, geometry, queryRadius)
            : undefined;
        }
      );
      // 监听点击事件
      this.handler.setInputAction((e) => {
        let pick = window.earth.scene.pick(e.position);
        console.log('pick', pick)
        if (pick && (~pick.id.id.indexOf('videopoint_'))) {
          console.log('fuck', pick.id.id, pick.id.name)
          this.$bus.$emit("cesium-3d-videoPointClick", {
            mp_id: pick.id.id,
            mp_name: pick.id.name,
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
    async drawVideoCircle(id, { lng, lat }, queryRadius, circleRadius = 500) {
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
        name: id,
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
        name: id,
      });
      this.videoCircleLabelCollection.entities.add(circleLabelEntity);
      this.videoCircleLabelList[circleLabelEntity.name] = circleLabelEntity;
      window.earth.zoomTo(circleEntity);

      // 画监控点
      const result = await getRtmpVideoList(
        {lng, lat},
        queryRadius,
      );
      console.log('result!!', result)
      this.SetRtmpList(result);
      result.forEach((item) => {
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
            this.populationCircleLabelList[id].id
          )
        : this.videoCircleLabelCollection.entities.removeAll();
    },
  },
  beforeDestroy() {
    this.handler.destroy();
  },
};
</script>

<style lang="less" scoped>
</style>
