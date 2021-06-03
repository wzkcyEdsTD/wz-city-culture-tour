<template>
  <div id="extra-model">
    <div id="extra-model-components">
      <Overview ref="overview" v-if="subModel == '3d1'" />
      <TrafficSubwayModel v-if="subModel == '3d4'" />
      <CarLineSpeed v-if="subModel == '3d10'" />
      <CarLineCount v-if="subModel == '3d11'" />
      <PeopleAreaHeat v-if="subModel == '3d20'" />
      <PeopleAreaCSGrid v-if="subModel == '3d21'" />
    </div>
    <div id="extra-object-components">
      <AroundSourceAnalyse ref="aroundSourceAnalyse" />
      <RtmpVideo />
      <Population />
      <VRFrame />
      <!-- 搜索框 -->
      <SearchBox ref="searchBox" v-show="subModel != '3d1'" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Overview from "components/sourcelayer/extraModel/Overview/Overview.vue";
import TrafficSubwayModel from "components/sourcelayer/extraModel/Models/TrafficSubwayModel";
import CarLineSpeed from "components/sourcelayer/extraModel/GeTuiAnalyse/CarLineSpeed";
import CarLineCount from "components/sourcelayer/extraModel/GeTuiAnalyse/CarLineCount";
import PeopleAreaHeat from "components/sourcelayer/extraModel/GeTuiAnalyse/PeopleAreaHeat";
import PeopleAreaCSGrid from "components/sourcelayer/extraModel/GeTuiAnalyse/PeopleAreaCSGrid";
import AroundSourceAnalyse from "components/sourcelayer/extraModel/AroundSourceAnalyse/AroundSourceAnalyse";
import RtmpVideo from "components/sourcelayer/extraModel/RtmpVideo/RtmpVideo";
import VRFrame from "components/sourcelayer/extraModel/VRFrame/VRFrame";
import Population from "components/sourcelayer/extraModel/Population/Population";
import SearchBox from "components/sourcelayer/layerHub/SearchBox/SearchBox";

export default {
  name: "extraModel",
  components: {
    Overview,
    TrafficSubwayModel,
    CarLineSpeed,
    CarLineCount,
    PeopleAreaHeat,
    PeopleAreaCSGrid,
    AroundSourceAnalyse,
    RtmpVideo,
    VRFrame,
    Population,
    SearchBox,
  },
  computed: {
    ...mapGetters("map", ["subModel"]),
  },
  created() {
    this.initPostRender();
  },
  mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetSubModel"]),
    eventRegsiter() {
      this.$bus.$on("cesium-3d-hub-event", ({ value }) => {
        this.SetSubModel(value);
      });
    },
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        //  *****[indexPoints]  城市总览指标*****
        if (this.subModel == "3d1" && this.$refs.overview.$refs.overviewNow) {
          this.$refs.overview.$refs.overviewNow.doIndexPoints();
        }
      });
    },
  },
};
</script>

<style></style>
