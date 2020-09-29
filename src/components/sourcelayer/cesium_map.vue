<!--
 * @Author: eds
 * @Date: 2020-08-20 18:52:41
 * @LastEditTime: 2020-09-15 11:01:20
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <!-- 气泡框 -->
    <div class="popup-groups">
      <BayonetPopup ref="bayonetPopup" />
      <TourPointPopup ref="tourPointPopup" />
      <MedicalPopup ref="medicalPopup" />
      <DetailPopup ref="detailPopup" />
      <StationPopup ref="stationPopup" />
    </div>
    <!-- 城市各类指标 -->
    <CityIndex ref="totalTarget" />
    <!-- 模块切换 -->
    <LayerHub ref="layerHub" v-if="initDataLoaded" />
    <!-- 时间转盘 -->
    <Roulette />
    <!-- 功能组件 -->
    <div v-if="mapLoaded && validated">
      <NanTangModel v-if="showSubFrame == '3d1'" />
      <Overview ref="overview" v-if="showSubHubFrame == '3d1'" />
      <TrafficSubwayModel v-if="showSubHubFrame == '3d4'" />
      <VideoCircle ref="videoCircle" />
      <RoadLine ref="roadline" />
      <InfoFrame ref="infoframe" v-show="isInfoFrame" />
      <transition name="fade">
        <div v-show="!isOverview">
          <RtmpVideo />
          <Population />
          <SearchBox ref="searchBox" />
        </div>
      </transition>
    </div>
    <AuthFailPopup ref="authFailPopup" v-if="authFailshallPop" />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import LayerHub from "components/sourcelayer/layerHub/layerHub";
import SearchBox from "./layerHub/searchBox";
import CityIndex from "./CityIndex/index";
import Roulette from "./roulette/roulette";
import NanTangModel from "./extraModel/NanTangModel";
import TrafficSubwayModel from "./extraModel/TrafficSubwayModel";
import InfoFrame from "./commonFrame/InfoFrame/InfoFrame";
import MedicalPopup from "./commonFrame/Popups/medicalPopup";
import BayonetPopup from "./commonFrame/Popups/bayonetPopup";
import StationPopup from "./commonFrame/Popups/stationPopup";
import DetailPopup from "./commonFrame/Popups/DetailPopup";
import TourPointPopup from "./commonFrame/Popups/tourPointPopup";
import RtmpVideo from "./extraModel/RtmpVideo/RtmpVideo";
import Population from "./extraModel/Population/Population";
import RoadLine from "./extraModel/PolylineTrailLink/RoadLine";
import VideoCircle from "./commonFrame/postMessage/videoCircle";
import AuthFailPopup from "./commonFrame/AuthFailPopup/AuthFailPopup";
import Overview from "./extraModel/Overview/Overview.vue";
import { getCurrentExtent, isContainByExtent } from "./commonFrame/mapTool";
import {
  mapConfigInit,
  mapImageLayerInit,
  mapMvtLayerInit,
  mapRiverLayerInit,
  mapBaimoLayerInit,
  mapRoadLampLayerInit,
} from "./cesium_map_init";
import { doValidation } from "api/validation/validation";
import { mapGetters } from "vuex";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      showSubFrame: null,
      showSubHubFrame: "3d1",
      mapLoaded: false,
      validated: false,
      isInfoFrame: false,
      authFailshallPop: false,
    };
  },
  computed: {
    ...mapGetters("map", ["initDataLoaded"]),
    isOverview() {
      return this.showSubHubFrame == "3d1";
    },
  },
  components: {
    LayerHub,
    SearchBox,
    CityIndex,
    Roulette,
    NanTangModel,
    TrafficSubwayModel,
    InfoFrame,
    MedicalPopup,
    BayonetPopup,
    StationPopup,
    TourPointPopup,
    DetailPopup,
    RtmpVideo,
    Population,
    RoadLine,
    VideoCircle,
    AuthFailPopup,
    Overview,
  },
  async mounted() {
    await this.init3DMap(() => {
      this.mapLoaded = true;
      this.initPostRender();
      this.initHandler();
      this.validate();
    });
    this.eventRegsiter();
  },
  methods: {
    async validate() {
      // let authorCode = this.$route.query.authorCode;
      // if (!authorCode) return (this.authFailshallPop = true);
      // const res = await doValidation(authorCode);
      // res ? (this.validated = true) : (this.authFailshallPop = true);
      this.validated = true;
    },
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        if (
          !window.earth ||
          !this.mapLoaded ||
          !this.validated ||
          !Object.keys(this.$refs).length
        )
          return;
        //  *****[medicalList] 医疗点位*****
        if (this.$refs.medicalPopup) {
          this.$refs.medicalPopup.fixPopup();
        }
        //  *****[bayonetList] 卡口点位*****
        if (this.$refs.bayonetPopup) {
          this.$refs.bayonetPopup.fixPopup();
        }
        //  *****[stationList] 站点点位*****
        if (this.$refs.stationPopup) {
          this.$refs.stationPopup.fixPopup();
        }
        //  *****[stationList] 景区点位*****
        if (this.$refs.tourPointPopup) {
          this.$refs.tourPointPopup.fixPopup();
        }
        //  *****[indexPoints]  城市总览指标*****
        if (this.isOverview && this.$refs.overview.$refs.overviewNow) {
          this.$refs.overview.$refs.overviewNow.doIndexPoints();
        }
        //  *****[videoCircle]  事件传递点位*****
        if (this.$refs.videoCircle && this.$refs.videoCircle.shallPop) {
          this.$refs.videoCircle.doPopup();
        }
        //  *****[detailPopup]  详情查看点位*****
        if (this.$refs.detailPopup) {
          this.$refs.detailPopup.renderForceEntity();
        }
      });
    },
    initHandler() {
      const handler = new Cesium.ScreenSpaceEventHandler(
        window.earth.scene.canvas
      );
      // 监听左键点击事件
      handler.setInputAction((e) => {
        const pick = window.earth.scene.pick(e.position);
        if (!pick.id || typeof pick.id != "object") return;
        //  *****[videoCircle]  监控视频点*****
        if (pick && pick.id.id && ~pick.id.id.indexOf("videopoint_")) {
          this.$refs.videoCircle.doSetRtmpList();
          this.$bus.$emit("cesium-3d-videoPointClick", {
            mp_id: pick.id.id,
            mp_name: pick.id.name,
          });
        }
        //  *****[detailPopup]  资源详情点*****
        if (pick.id.extra_data) {
          this.$refs.detailPopup.getForceEntity({
            extra_data: pick.id.extra_data,
            fix_data: pick.id.fix_data,
            position: pick.id._position._value,
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    /**
     * 事件注册
     */
    eventRegsiter() {
      this.$bus.$off("cesium-3d-event");
      this.$bus.$on("cesium-3d-event", ({ value }) => {
        this.showSubFrame = value;
      });
      this.$bus.$on("cesium-3d-switch", ({ value }) => {
        this.$bus.$emit("cesium-3d-event", { value: !value ? "3d1" : null });
        ServiceUrl.WZBaimo_OBJ.map(({ KEY }) => {
          const _LAYER_ = window.earth.scene.layers.find(KEY);
          _LAYER_.visible = !value ? false : true;
        });
        //  底图切换
        window.datalayer.show = !value ? false : true;
        window.imagelayer
          ? (window.imagelayer.show = !value ? true : false)
          : !value
          ? (window.imagelayer = mapImageLayerInit(ServiceUrl.SWImage))
          : undefined;
        //  历史页面做回调
        this.$bus.$emit("cesium-3d-switch-pass");
      });
      this.$bus.$on("cesium-3d-hub-event", ({ value }) => {
        this.showSubHubFrame = value;
      });
    },
    /**
     * 地图初始化
     * @param {function} fn 回调函数
     */
    async init3DMap(fn) {
      const that = this;
      window.earth = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
      });
      //  地图配置
      mapConfigInit();
      //  相机位置
      this.cameraMove();
      //  大数据地图
      window.datalayer = mapImageLayerInit(ServiceUrl.DataImage);
      //  地图注记
      const mapMvt = mapMvtLayerInit("mapMvt", ServiceUrl.YJMVT);
      //  重要地物注记
      const keyMvt = mapMvtLayerInit("keyMvt", ServiceUrl.KEYMVT);
      //  水面
      await mapRiverLayerInit("RIVER", ServiceUrl.RIVER);
      //  白模叠加
      await mapBaimoLayerInit(ServiceUrl.WZBaimo_OBJ);
      //  路灯、光源叠加
      // await mapRoadLampLayerInit("ROADLAMP", ServiceUrl.ROAD_LAMP);
      //  回调钩子
      fn && fn();
    },
    /**
     * move your fat ass bro
     */
    cameraMove() {
      window.earth.scene.camera.setView({
        destination: {
          x: -2875301.1196146533,
          y: 4843728.17360857,
          z: 2993569.51865382,
        },
        orientation: {
          heading: 0.0033168860454315663,
          pitch: -0.5808830390057396,
          roll: 0,
        },
      });
    },
  },
};
</script>

<style lang="less">
.cesiumContainer {
  height: 100%;
  width: 100%;
  #cesiumContainer {
    height: 100%;
    width: 100%;
    // color: rgb(42, 104, 163);
  }
}
.mapCover {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 8;
}
.cesium-viewer-navigationContainer {
  display: none;
}
</style>
