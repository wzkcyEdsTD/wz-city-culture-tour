<template>
  <div class="around-source-analyse" v-show="forceEntity">
    <span class="header"
      >周边分析
      <i class="around-source-close" @click="closeAroundSourceAnalyse">x</i>
    </span>
    <div class="around-source-pick">
      <el-select
        class="around-source-select-source"
        v-model="selectSourceLayer"
        multiple
        collapse-tags
        :clearable="true"
        placeholder="请选择"
        @change="sourceUpdateHandler"
      >
        <el-option
          v-for="item in aroundOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        class="around-source-select-distance"
        v-model="distance"
        @change="distanceUpdateHandler"
      >
        <el-option
          v-for="item in distanceOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="around-source-list">
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in aroundSourceAnalyseList" :key="index">
          <template slot="title">
            <img
              class="around-source-list-icon"
              :src="`/static/images/map-ico/${item.title}.png`"
            /><span>{{ `${item.title} (${item.list.length})` }}</span>
          </template>
          <div
            class="around-source-list-single"
            v-for="(value, subIndex) in item.list"
            :key="subIndex"
          >
            <img class="single-location" src="/static/images/common/location.png" />
            <span class="single-title" :title="value.resourceName">{{
              value.resourceName
            }}</span>
            <span class="single-distance">{{ (+value.distance).toFixed(2) }}m</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { CESIUM_TREE_AROUND_ANALYSE_OPTION } from "config/server/sourceTreeOption";
import {
  aroundSourceAnalyseDraw,
  initPrimitivesCollection,
  aroundSourceAnalyseCircle,
} from "./AroundSourceAnalyseDraw";
import { arrayCompareWithParam } from "common/js/util";
import { getAroundSourceAnalyse } from "@/api/layerServerAPI";
const aroundOption = CESIUM_TREE_AROUND_ANALYSE_OPTION.children.map(
  ({ label, resourceType }) => {
    return { value: resourceType, label };
  }
);
export default {
  name: "aroundSourceAnalyse",
  data() {
    return {
      // forceEntity: { lng: 120.654218, lat: 28.016064 },
      forceEntity: undefined,
      distance: 250,
      distanceOption: [
        { value: 250, label: "250m" },
        { value: 500, label: "500m" },
        { value: 1000, label: "1000m" },
      ],
      selectSourceLayer: [],
      aroundOption,
      aroundSourceAnalyseList: [],
    };
  },
  props: ["force"],
  computed: {
    ...mapGetters("map", []),
  },
  created() {
    this.initSelectSourceLayer();
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {},
  methods: {
    eventRegsiter() {
      this.$bus.$off("cesium-3d-around-analyse-pick");
      this.$bus.$on("cesium-3d-around-analyse-pick", (forceEntity) => {
        this.initSelectSourceLayer();
        this.forceEntity = forceEntity;
        this.fetchSourceAround(forceEntity);
      });
    },
    /**
     * 获取周边分析圈,执行周边分析
     * @param {object} forceEntity 分析点
     */
    fetchSourceAround(forceEntity) {
      const { lng, lat } = forceEntity;
      const distance = this.distance;
      const aroundSourceAnalyseList = [];
      //  统一清除 circle label icon
      aroundOption.map(({ value }) => initPrimitivesCollection(value));
      //  周边分析
      aroundOption
        .filter((v) => ~this.selectSourceLayer.indexOf(v.value))
        .map(async ({ label, value }) => {
          const { data } = await getAroundSourceAnalyse({
            resourceType: value,
            lng,
            lat,
            distance,
          });
          const sourceAnalyseResult = {
            title: label,
            key: value,
            list: data.sort(arrayCompareWithParam("distance")),
            dataset: CESIUM_TREE_AROUND_ANALYSE_OPTION.children.filter(
              ({ resourceType }) => resourceType == value
            )[0],
          };
          aroundSourceAnalyseList.push(sourceAnalyseResult);
          //  周边分析画点
          aroundSourceAnalyseDraw(sourceAnalyseResult);
        });
      //  周边分析画圆
      aroundSourceAnalyseCircle(lng, lat, distance);
      this.aroundSourceAnalyseList = aroundSourceAnalyseList;
    },
    initSelectSourceLayer() {
      this.selectSourceLayer = aroundOption
        .map((v) => v.value)
        .filter((v) => v != "fire_hydrant");
    },
    //  重新分析
    sourceUpdateHandler() {
      this.fetchSourceAround(this.forceEntity);
    },
    //  重新分析
    distanceUpdateHandler() {
      this.fetchSourceAround(this.forceEntity);
    },
    //  关闭周边分析
    closeAroundSourceAnalyse() {
      aroundOption.map(({ value }) => initPrimitivesCollection(value));
      this.forceEntity = undefined;
      this.selectSourceLayer = [];
      this.aroundSourceAnalyseList = [];
      this.$bus.$emit("cesium-poi-location-clear");
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./AroundSourceAnalyse.less");
</style>
