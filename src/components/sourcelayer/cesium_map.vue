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
    <div v-if="mapLoaded && validated">
      <TreeTool ref="treetool" />
      <TotalTarget ref="totalTarget" />
      <Roulette />
      <NanTangModel v-if="showSubFrame == '3d1'" />
      <InfoFrame ref="infoframe" v-show="isInfoFrame" />
      <MedicalPopup ref="medicalPopup" />
      <DetailPopup ref="detailPopup" />
      <RtmpVideo />
      <Population />
      <RoadLine ref="roadline" />
      <VideoCircle ref="videoCircle" />
    </div>
    <AuthFailPopup ref="authFailPopup" v-if="mapLoaded && authFailshallPop" />
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import TreeTool from "./treeTool/TreeTool";
import TotalTarget from "./totalTarget/index";
import Roulette from "./roulette/roulette";
import NanTangModel from "./extraModel/NanTangModel";
import InfoFrame from "./commonFrame/InfoFrame/InfoFrame";
import MedicalPopup from "./commonFrame/MedicalPopup/medicalPopup";
import DetailPopup from "./commonFrame/DetailPopup/DetailPopup";
import RtmpVideo from "./extraModel/RtmpVideo/RtmpVideo";
import Population from "./extraModel/Population/Population";
import RoadLine from "./extraModel/PolylineTrailLink/RoadLine";
import VideoCircle from "./commonFrame/postMessage/videoCircle";
import AuthFailPopup from "./commonFrame/AuthFailPopup/AuthFailPopup";
import { getCurrentExtent, isContainByExtent } from "./commonFrame/mapTool";
import { doValidation } from "api/validation/validation";
import { mapGetters, mapActions } from "vuex";
const Cesium = window.Cesium;

export default {
  data() {
    return {
      showSubFrame: null,
      showSubTool: null,
      mapLoaded: false,
      validated: false,
      imagelayer: undefined,
      datalayer: undefined,
      isInfoFrame: false,
      handler: undefined,
      authFailshallPop: false,
    };
  },
  computed: {
    ...mapGetters("map", ["medicalListWithGeometry"]),
  },
  components: {
    TreeTool,
    TotalTarget,
    Roulette,
    NanTangModel,
    InfoFrame,
    MedicalPopup,
    DetailPopup,
    RtmpVideo,
    Population,
    RoadLine,
    VideoCircle,
    AuthFailPopup,
  },
  async mounted() {
    this.init3DMap(() => {
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
        const medicalList = this.medicalListWithGeometry;
        if (medicalList && medicalList.length) {
          const extent = getCurrentExtent();
          const G_medicalList = [];
          medicalList.map((item) => {
            if (item.geometry && isContainByExtent(extent, item.geometry)) {
              const { x, y } = item.geometry;
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.earth.scene,
                Cesium.Cartesian3.fromDegrees(x, y, 0)
              );
              G_medicalList.push({ ...item, pointToWindow });
            }
          });
          this.$refs.medicalPopup &&
            this.$refs.medicalPopup.doPopup(G_medicalList);
        } else {
          this.$refs.medicalPopup && this.$refs.medicalPopup.doPopup([]);
        }
        //  *****[videoCircle]  事件传递点位*****
        if (this.$refs.videoCircle.shallPop) {
          this.$refs.videoCircle && this.$refs.videoCircle.doPopup();
        }
        //  *****[detailPopup]  详情查看点位*****
        const forceEntity = this.$refs.detailPopup.forceEntity;
        if (forceEntity.extra_data) {
          const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            window.earth.scene,
            forceEntity.position
          );
          this.$refs.detailPopup.renderForceEntity(pointToWindow);
        }
      });
    },
    initHandler() {
      this.handler = new Cesium.ScreenSpaceEventHandler(
        window.earth.scene.canvas
      );
      // 监听左键点击事件
      this.handler.setInputAction((e) => {
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
    eventRegsiter() {
      this.$bus.$off("cesium-3d-event");
      this.$bus.$on("cesium-3d-event", ({ value }) => {
        this.showSubFrame = value;
      });
      this.$bus.$off("cesium-3d-maptool");
      this.$bus.$on("cesium-3d-maptool", ({ value }) => {
        this.showSubTool = value;
      });
      this.$bus.$off("cesium-3d-switch");
      this.$bus.$on("cesium-3d-switch", ({ value }) => {
        const _LAYER_ = window.earth.scene.layers.find("baimo");
        _LAYER_.visible = !value ? false : true;
        //  底图切换
        this.datalayer.show = !value ? false : true;
        this.imagelayer
          ? (this.imagelayer.show = !value ? true : false)
          : !value
          ? (this.imagelayer = window.earth.imageryLayers.addImageryProvider(
              new Cesium.SuperMapImageryProvider({
                url: ServiceUrl.SWImage,
              })
            ))
          : undefined;
      });
    },
    init3DMap(fn) {
      const that = this;
      const viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        shadows: false, //  内存吃不消
      });
      viewer.imageryLayers.get(0).show = false;
      viewer.scene.globe.baseColor = new Cesium.Color.fromCssColorString(
        "rgba(13,24,45, 1)"
      );
      this.datalayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: ServiceUrl.DataImage,
        })
      );
      const mapMvt = viewer.scene.addVectorTilesMap({
        url: ServiceUrl.YJMVT,
        name: "mapMvt",
        viewer,
      });
      window.earth = viewer;
      const baimoPromise = viewer.scene.addS3MTilesLayerByScp(
        ServiceUrl.WZBaimo,
        {
          name: "baimo",
        }
      );
      Cesium.when(baimoPromise, async ([forceLayer, ...oLayer]) => {
        const LAYER = viewer.scene.layers.find("baimo");
        LAYER.style3D.fillForeColor = new Cesium.Color.fromCssColorString(
          "rgba(137,137,137, 1)"
        );
        const hyp = new Cesium.HypsometricSetting();
        const colorTable = new Cesium.ColorTable();
        hyp.MaxVisibleValue = 300;
        hyp.MinVisibleValue = 0;
        colorTable.insert(300, new Cesium.Color(1, 1, 1));
        colorTable.insert(160, new Cesium.Color(0.95, 0.95, 0.95));
        colorTable.insert(76, new Cesium.Color(0.7, 0.7, 0.7));
        colorTable.insert(0, new Cesium.Color(13 / 255, 24 / 255, 45 / 255));
        hyp.ColorTable = colorTable;
        hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
        hyp.Opacity = 1;
        //  贴图纹理
        hyp.emissionTextureUrl = "/static/images/area/speedline.png";
        hyp.emissionTexCoordUSpeed = 0.2;
        LAYER.hypsometricSetting = {
          hypsometricSetting: hyp,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
        };
        LAYER.visibleDistanceMax = 5000;
      });
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      viewer.scene.globe.depthTestAgainstTerrain = false;
      this.cameraMove();
      this.addPointLight();
      fn && fn();
    },
    addPointLight() {
      // window.earth.scene.bloomEffect.threshold = 0.85;
      // window.earth.scene.bloomEffect.bloomIntensity = 5;
      window.earth.scene.fxaa = true;
      // const position = new Cesium.Cartesian3(
      //   -2876658.347784866,
      //   4840022.695245349,
      //   2996644.580693739
      // );
      // const options = {
      //   intensity: 0.5,
      // };
      // const directionalLight_v = new Cesium.DirectionalLight(position, options);
      // window.earth.scene.addLightSource(directionalLight_v);
    },
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

<style lang="less" scoped>
.cesiumContainer {
  height: 100%;
  width: 100%;
  #cesiumContainer {
    height: 100%;
    width: 100%;
    // color: rgb(42, 104, 163);
  }
}
</style>
