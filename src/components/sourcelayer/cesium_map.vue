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
    <!-- 功能组件 -->
    <div v-if="mapLoaded && validated">
      <!-- 城市各类指标 -->
      <CityIndex ref="totalTarget" />
      <!-- 菜单切换 -->
      <LayerHub ref="layerHub" v-if="initDataLoaded" />
      <!-- 时间转盘 -->
      <Roulette ref="roulette" />
      <!-- 气泡框 -->
      <PopupHub />
      <!-- 场景 -->
      <ExtraModel />
      <!-- 白天、夜晚精模 -->
      <NightModel v-if="sceneModel" />
      <DayModel v-if="!sceneModel" />
    </div>
    <!-- 验证失败弹窗 -->
    <AuthFailPopup ref="authFailPopup" v-if="authFailshallPop" />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import LayerHub from "components/sourcelayer/layerHub/layerHub";
import CityIndex from "components/sourcelayer/CityIndex/index";
import Roulette from "components/sourcelayer/roulette/roulette";
import PopupHub from "components/sourcelayer/commonFrame/Popups/PopupHub";
import ExtraModel from "components/sourcelayer/extraModel/ExtraModel";
import DayModel from "components/sourcelayer/extraModel/Models/DayModel";
import NightModel from "components/sourcelayer/extraModel/Models/NightModel";
import AuthFailPopup from "components/sourcelayer/commonFrame/AuthFailPopup/AuthFailPopup";
import { CenterPoint } from "mock/overview.js";
import { mapConfigInit, mapMvtLayerInit } from "components/sourcelayer/cesium_map_init";
import { doValidation } from "api/validation/validation";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      sceneModel: true,
      mapLoaded: false,
      validated: false,
      authFailshallPop: false,
    };
  },
  computed: {
    ...mapGetters("map", ["initDataLoaded", "forceTreeLabel", "isSourceLayer"]),
  },
  components: {
    LayerHub,
    CityIndex,
    Roulette,
    PopupHub,
    ExtraModel,
    DayModel,
    NightModel,
    AuthFailPopup,
  },
  created() {
    //  点位信息 hash
    window.featureMap = {};
    //  点位icon hash
    window.billboardMap = {};
    //  点位label hash
    window.labelMap = {};
    //  额外各类primitive
    window.extraPrimitiveMap = {};
    //  特殊信息 hash
    window.entityMapGeometry = {};
  },
  async mounted() {
    await this.init3DMap(async () => {
      this.mapLoaded = true;
      await this.validate();
      if (!this.authFailshallPop) {
        this.initScene();
        this.initHandler();
      }
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

    initHandler() {
      const handler = new Cesium.ScreenSpaceEventHandler(window.earth.scene.canvas);
      // 监听左键点击事件
      handler.setInputAction((e) => {
        const pick = window.earth.scene.pick(e.position);
        if (!pick && !pick.primitive && !pick.id) return;
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
          const [_TYPE_, _SMID_, _NODEID_, _LOCATION_] = pick.id.split("@");
          if (_TYPE_.includes("eventLayer_")) {
            this.$bus.$emit("cesium-3d-pick-to-event", {
              ...window.featureMap[_NODEID_][_SMID_],
              position: pick.primitive.position,
            });
          } else {
            //  *****[detailPopup]  资源详情点*****
            if (~["label", "billboard"].indexOf(_TYPE_)) {
              const isLocated = ~["location"].indexOf(_LOCATION_);
              this.$bus.$emit(`cesium-3d-pick-to-${isLocated ? "locate" : "detail"}`, {
                ...window.featureMap[_NODEID_][_SMID_],
                position: pick.primitive.position,
                isLocated,
              });
            }
          }
        }
        //  网格分析点击
        if (
          pick.primitive &&
          pick.primitive._instanceIds.length &&
          pick.primitive._instanceIds[0]
        ) {
          const [BUS_EVENT_TAG_CLICK, x, y, count] = pick.primitive._instanceIds[0].split(
            "@"
          );
          BUS_EVENT_TAG_CLICK && this.$bus.$emit(BUS_EVENT_TAG_CLICK, { x, y, count });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    /**
     * 事件注册
     */
    eventRegsiter() {
      this.$bus.$off("cesium-3d-event");
      this.$bus.$on("cesium-3d-event", (boolean) => {
        this.sceneModel = boolean;
        //  历史页面做回调
        this.$bus.$emit("cesium-3d-switch-pass");
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
        shadows: false,
        // timeline:true,
        // contextOptions: {
        //   maxDrawingBufferWidth: 15360,
        //   maxDrawingBufferHeight: 4320,
        // },
      });
      //  地图配置
      mapConfigInit();
      //  回调钩子
      fn && fn();
    },
    initScene() {
      //  相机位置
      this.cameraMove();
      //  地图注记
      mapMvtLayerInit("mapMvt", ServiceUrl.YJMVT);
      //  重要地物注记
      // const keyMvt = mapMvtLayerInit("keyMvt", ServiceUrl.KEYMVT);
    },
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

.cesium-viewer-navigationContainer {
  display: none;
}
</style>
