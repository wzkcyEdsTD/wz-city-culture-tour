<template>
  <div class="popup-hub">
    <BayonetPopup ref="bayonetPopup" />
    <TourPointPopup ref="tourPointPopup" />
    <MedicalPopup ref="medicalPopup" />
    <StationPopup ref="stationPopup" />
    <DetailPopup ref="detailPopup" />
    <EventPopup ref="eventPopup" />
    <!-- 视频弹窗 -->
    <VideoCircle ref="videoCircle" />
    <!-- 医院信息 -->
    <InfoFrame ref="infoframe" v-show="isInfoFrame" />
  </div>
</template>

<script>
import MedicalPopup from "./medicalPopup";
import BayonetPopup from "./bayonetPopup";
import StationPopup from "./stationPopup";
import DetailPopup from "./DetailPopup";
import EventPopup from "./EventPopup";
import TourPointPopup from "./tourPointPopup";
import VideoCircle from "components/sourcelayer/commonFrame/postMessage/videoCircle";
import InfoFrame from "components/sourcelayer/commonFrame/InfoFrame/InfoFrame";

export default {
  name: "PopupHub",
  data() {
    return { isInfoFrame: false };
  },
  components: {
    MedicalPopup,
    BayonetPopup,
    StationPopup,
    TourPointPopup,
    DetailPopup,
    EventPopup,
    VideoCircle,
    InfoFrame,
  },
  mounted() {
    this.initPostRender();
  },
  methods: {
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        if (!window.earth) return;
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
        //  *****[videoCircle]  事件传递点位*****
        if (this.$refs.videoCircle && this.$refs.videoCircle.shallPop) {
          this.$refs.videoCircle.doPopup();
        }
        //  *****[detailPopup]  详情查看点位*****
        if (this.$refs.detailPopup) {
          this.$refs.detailPopup.renderForceEntity();
        }
        //  *****[eventPopup]  事件详情查看点位*****
        if (this.$refs.eventPopup) {
          this.$refs.eventPopup.renderForceEntity();
        }
      });
    },
  },
};
</script>
