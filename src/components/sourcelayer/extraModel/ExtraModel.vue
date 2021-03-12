<template>
  <div id="extra-model">
    <div id="extra-model-components">
      <Overview ref="overview" v-if="subModel == '3d1'" />
      <TrafficSubwayModel v-if="subModel == '3d4'" />
      <CarLineCount v-if="subModel == '3d5'" />
      <PeopleAreaHeat v-if="subModel == '3d6'" />
    </div>
    <div id="extra-object-components">
      <AroundSourceAnalyse ref="aroundSourceAnalyse" />
      <RtmpVideo />
      <Population />
      <!-- 搜索框 -->
      <SearchBox ref="searchBox" v-show="subModel != '3d1'" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Overview from "components/sourcelayer/extraModel/Overview/Overview.vue";
import TrafficSubwayModel from "components/sourcelayer/extraModel/Models/TrafficSubwayModel";
import CarLineCount from "components/sourcelayer/extraModel/GeTuiAnalyse/CarLineCount";
import PeopleAreaHeat from "components/sourcelayer/extraModel/GeTuiAnalyse/PeopleAreaHeat";
import AroundSourceAnalyse from "components/sourcelayer/extraModel/AroundSourceAnalyse/AroundSourceAnalyse";
import RtmpVideo from "components/sourcelayer/extraModel/RtmpVideo/RtmpVideo";
import Population from "components/sourcelayer/extraModel/Population/Population";
import SearchBox from "components/sourcelayer/layerHub/SearchBox/SearchBox";

export default {
  name: "extraModel",
  components: {
    Overview,
    TrafficSubwayModel,
    CarLineCount,
    PeopleAreaHeat,
    AroundSourceAnalyse,
    RtmpVideo,
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
