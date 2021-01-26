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
    <!-- 搜索框 -->
    <div v-show="!isOverview"><SearchBox ref="searchBox" /></div>
    <!-- 模块切换 -->
    <LayerHub ref="layerHub" v-if="initDataLoaded" />
    <!-- 时间转盘 -->
    <Roulette />
    <!-- 功能组件 -->
    <div v-if="mapLoaded && validated">
      <DetailedModel v-if="showSubFrame == '3d1'" />
      <!-- <CesiumMapVideo v-if="showSubFrame == '3d1'" /> -->
      <Overview ref="overview" v-if="showSubHubFrame == '3d1'" />
      <TrafficSubwayModel v-if="showSubHubFrame == '3d4'" />
      <VideoCircle ref="videoCircle" />
      <RoadLine ref="roadline" />
      <InfoFrame ref="infoframe" v-show="isInfoFrame" />
      <div v-show="!isOverview">
        <RtmpVideo />
        <Population />
      </div>
    </div>
    <AuthFailPopup ref="authFailPopup" v-if="authFailshallPop" />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
// import CesiumMapVideo from "components/sourcelayer/extraModel/CesiumMapVideo/CesiumMapVideo";
import LayerHub from "components/sourcelayer/layerHub/layerHub";
import SearchBox from "components/sourcelayer/layerHub/searchBox";
import CityIndex from "components/sourcelayer/CityIndex/index";
import Roulette from "components/sourcelayer/roulette/roulette";
import DetailedModel from "components/sourcelayer/extraModel/Models/DetailedModel";
import TrafficSubwayModel from "components/sourcelayer/extraModel/Models/TrafficSubwayModel";
import InfoFrame from "components/sourcelayer/commonFrame/InfoFrame/InfoFrame";
import MedicalPopup from "components/sourcelayer/commonFrame/Popups/medicalPopup";
import BayonetPopup from "components/sourcelayer/commonFrame/Popups/bayonetPopup";
import StationPopup from "components/sourcelayer/commonFrame/Popups/stationPopup";
import DetailPopup from "components/sourcelayer/commonFrame/Popups/DetailPopup";
import TourPointPopup from "components/sourcelayer/commonFrame/Popups/tourPointPopup";
import RtmpVideo from "components/sourcelayer/extraModel/RtmpVideo/RtmpVideo";
import Population from "components/sourcelayer/extraModel/Population/Population";
import RoadLine from "components/sourcelayer/extraModel/PolylineTrailLink/RoadLine";
import VideoCircle from "components/sourcelayer/commonFrame/postMessage/videoCircle";
import AuthFailPopup from "components/sourcelayer/commonFrame/AuthFailPopup/AuthFailPopup";
import Overview from "components/sourcelayer/extraModel/Overview/Overview.vue";
import {
  getCurrentExtent,
  isContainByExtent,
} from "components/sourcelayer/commonFrame/mapTool";
import { CenterPoint } from "mock/overview.js";
import {
  mapConfigInit,
  mapImageLayerInit,
  mapMvtLayerInit,
  mapRiverLayerInit,
  mapBaimoLayerInit,
  mapRoadLampLayerInit,
  mapRoadLampLayerTurn,
  mapShadowInit,
} from "components/sourcelayer/cesium_map_init";
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
    ...mapGetters("map", ["initDataLoaded", "forceTreeLabel"]),
    isOverview() {
      return this.showSubHubFrame == "3d1";
    },
  },
  created() {
    this.forceTreeLabel == "城市总览" && (this.showSubHubFrame = "3d1");
  },
  components: {
    // CesiumMapVideo,
    LayerHub,
    SearchBox,
    CityIndex,
    Roulette,
    DetailedModel,
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
  created() {
    //  点位信息 hash
    window.featureMap = {};
    //  点位icon hash
    window.billboardMap = {};
    //  点位label hash
    window.labelMap = {};
    //  特殊信息 hash
    window.entityMapGeometry = {};
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
        if (!window.earth || !this.mapLoaded || !this.validated) return;
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
      const handler = new Cesium.ScreenSpaceEventHandler(window.earth.scene.canvas);
      // 监听左键点击事件
      handler.setInputAction((e) => {
        const pick = window.earth.scene.pick(e.position);
        if (!pick || !pick.id) return;
        if (typeof pick.id == "object") {
          //  *****[videoCircle]  监控视频点*****
          if (pick.id.id && ~pick.id.id.indexOf("videopoint_")) {
            this.$bus.$emit("cesium-3d-videoPointClick", {
              mp_id: pick.id.id,
              mp_name: pick.id.name,
            });
          }
          if (pick.id.id && ~pick.id.id.indexOf("normalpoint_")) {
            this.$bus.$emit("cesium-3d-normalPointClick", {
              mp_id: pick.id.id,
              mp_name: pick.id.name,
            });
          }
        } else if (typeof pick.id == "string") {
          const [_TYPE_, _SMID_, _NODEID_] = pick.id.split("@");
          //  *****[detailPopup]  资源详情点*****
          if (~["label", "billboard"].indexOf(_TYPE_)) {
            this.$refs.detailPopup.getForceEntity({
              ...window.featureMap[_NODEID_][_SMID_],
              position: pick.primitive.position,
            });
          }
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
        //  鼠标缩放限制
        // window.earth.scene.screenSpaceCameraController.maximumZoomDistance = !value
        //   ? 800
        //   : Infinity;
        //  底图切换
        window.datalayer.show = !value ? false : true;
        window.imagelayer
          ? (window.imagelayer.show = !value ? true : false)
          : !value
          ? (window.imagelayer = mapImageLayerInit(ServiceUrl.SWImage))
          : undefined;
        //  光源显示
        mapRoadLampLayerTurn(!value ? false : true);
        //  河流显示
        window.earth.scene.layers.find("RIVER").visible = !value ? true : false;
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
      window.earth = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        // timeline:true,
        shadows: false,
        // contextOptions: {
        //   maxDrawingBufferWidth: 15360,
        //   maxDrawingBufferHeight: 4320,
        // },
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
      // const keyMvt = mapMvtLayerInit("keyMvt", ServiceUrl.KEYMVT);
      //  水面
      await mapRiverLayerInit("RIVER", ServiceUrl.STATIC_RIVER);
      //  白模叠加
      await mapBaimoLayerInit(ServiceUrl.WZBaimo_OBJ);
      //  路灯、光源叠加
      mapRoadLampLayerInit();
      //  阴影
      // mapShadowInit();
      //  回调钩子
      fn && fn();
    },
    /**
     * move your fat ass bro
     */
    cameraMove() {
      window.earth.scene.camera.setView(CenterPoint);
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
