<!--
 * @Author: eds
 * @Date: 2020-08-20 18:52:41
 * @LastEditTime: 2020-09-15 11:01:20
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\trafficlayer\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <!-- 气泡框 -->
    <div class="popup-groups">
      <BayonetPopup ref="bayonetPopup" />
      <DetailPopup ref="detailPopup" />
      <StationPopup ref="stationPopup" />
    </div>
    <!-- 城市各类指标 -->
    <CityIndex ref="totalTarget" />
    <!-- 搜索框 -->
    <SearchBox ref="searchBox" />
    <!-- 模块切换 -->
    <LayerHub ref="layerHub" v-if="initDataLoaded" />
    <!-- 功能组件 -->
    <div v-if="mapLoaded && validated">
      <DetailedModel v-if="showSubFrame == '3d1'" />
      <!-- <CesiumMapVideo v-if="showSubFrame == '3d1'" /> -->
      <TrafficSubwayModel v-if="showSubHubFrame == '3d4'" />
      <RoadLine ref="roadline" />
      <RtmpVideo />
      <Population />
      <!-- 监控实况 -->
      <RtmpVideoGrid />
    </div>
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
// import CesiumMapVideo from "components/trafficlayer/extraModel/CesiumMapVideo/CesiumMapVideo";
import LayerHub from "components/trafficlayer/layerHub/layerHub";
import SearchBox from "components/trafficlayer/layerHub/searchBox";
import CityIndex from "components/trafficlayer/CityIndex/index";
import DetailedModel from "components/trafficlayer/extraModel/Models/DetailedModel";
import TrafficSubwayModel from "components/trafficlayer/extraModel/Models/TrafficSubwayModel";
import BayonetPopup from "components/trafficlayer/commonFrame/Popups/bayonetPopup";
import StationPopup from "components/trafficlayer/commonFrame/Popups/stationPopup";
import DetailPopup from "components/trafficlayer/commonFrame/Popups/DetailPopup";
import RtmpVideo from "components/trafficlayer/extraModel/RtmpVideo/RtmpVideo";
import Population from "components/trafficlayer/extraModel/Population/Population";
import RoadLine from "components/trafficlayer/extraModel/PolylineTrailLink/RoadLine";
import RtmpVideoGrid from "components/trafficlayer/extraModel/RtmpVideoGrid/RtmpVideoGrid";
import {
  getCurrentExtent,
  isContainByExtent,
} from "components/trafficlayer/commonFrame/mapTool";
import { CenterPoint } from "mock/overview.js";
import {
  mapConfigInit,
  mapImageLayerInit,
  mapMvtLayerInit,
  mapRiverLayerInit,
  mapBaimoLayerInit,
  mapRoadLampLayerInit,
  mapRoadLampLayerTurn,
} from "components/trafficlayer/cesium_map_init";
import { doValidation } from "api/validation/validation";
import { mapGetters } from "vuex";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      showSubFrame: null,
      showSubHubFrame: "",
      mapLoaded: false,
      validated: false,
      isInfoFrame: false,
    };
  },
  computed: {
    ...mapGetters("traffic", ["initDataLoaded", "forceTreeLabel"]),
  },
  components: {
    // CesiumMapVideo,
    LayerHub,
    SearchBox,
    CityIndex,
    DetailedModel,
    TrafficSubwayModel,
    BayonetPopup,
    StationPopup,
    DetailPopup,
    RtmpVideo,
    Population,
    RoadLine,
    RtmpVideoGrid,
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
      this.validated = true;
    },
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        if (!window.earth || !this.mapLoaded || !this.validated) return;
        //  *****[bayonetList] 卡口点位*****
        if (this.$refs.bayonetPopup) {
          this.$refs.bayonetPopup.fixPopup();
        }
        //  *****[stationList] 站点点位*****
        if (this.$refs.stationPopup) {
          this.$refs.stationPopup.fixPopup();
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
        if (!pick || !pick.id) return;
        if (typeof pick.id == "object") {
          //  *****[videoCircle]  监控视频点*****
          // if (pick.id.id && ~pick.id.id.indexOf("videopoint_")) {
          //   this.$bus.$emit("cesium-3d-videoPointClick", {
          //     mp_id: pick.id.id,
          //     mp_name: pick.id.name,
          //   });
          // }
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
      const that = this;
      window.earth = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        shadows: false,
        contextOptions: {
          // maxDrawingBufferWidth: 15360,
          // maxDrawingBufferHeight: 4320,
          maxDrawingBufferWidth: 3840,
          maxDrawingBufferHeight: 1080,
        },
        // terrainShadows: Cesium.ShadowMode.ENABLED,
        // shouldAnimate: true,
        // terrainProvider: Cesium.createWorldTerrain(),
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
