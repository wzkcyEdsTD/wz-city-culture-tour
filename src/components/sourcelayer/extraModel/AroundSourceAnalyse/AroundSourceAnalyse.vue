<template>
  <div class="around-source-analyse" v-show="forceEntity">
    <span class="header"
      >事件详情
      <img src="/static/images/common/warn-icon.png" />
      <i class="around-source-close" @click="closeAroundSourceAnalyse">x</i>
    </span>
    <ul class="around-content-body" v-if="forceEntity">
      <li
        v-for="(item, key, index) in forceEntity.fix_data"
        :key="index"
        v-show="item && !~filterKey.indexOf(key)"
      >
        <span>{{ key }}</span>
        <span>{{ item }}</span>
      </li>
    </ul>
    <span class="header">周边分析 </span>
    <div class="around-source-pick">
      <el-select
        class="around-source-select-source el-event-select"
        v-model="selectSourceLayer"
        multiple
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
    </div>
    <div class="around-source-list">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item
          v-for="(item, index) in aroundSourceAnalyseList"
          :key="index"
          :name="item.title"
        >
          <template slot="title">
            <img
              class="around-source-list-icon"
              :src="`/static/images/map-ico/${item.title}.png`"
            /><span>{{ `${item.title} (${item.list.length})` }}</span>
            <el-select
              class="around-source-select-distance el-event-select"
              v-model="aroundDistance[item.key]"
              size="small"
              @change="distanceUpdateHandler"
            >
              <el-option
                v-for="item in distanceOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <div
            class="around-source-list-single"
            v-for="(value, subIndex) in item.list"
            :key="subIndex"
            @click="forceAnalyseSingle(item.key, value)"
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
  aroundSourceAnalyseCircleClear,
} from "./AroundSourceAnalyseDraw";
import { arrayCompareWithParam } from "common/js/util";
import { getAroundSourceAnalyse } from "@/api/layerServerAPI";
const RANGE_DISTANCE = 1050;
const DEFAULT_DISTANCE = 100000;
const aroundDistance = {};
const aroundOption = CESIUM_TREE_AROUND_ANALYSE_OPTION.children.map(
  ({ label, resourceType }) => {
    aroundDistance[resourceType] = DEFAULT_DISTANCE;
    return { value: resourceType, label };
  }
);

export default {
  name: "aroundSourceAnalyse",
  data() {
    return {
      forceEntity: undefined,
      aroundDistance,
      distanceOption: [
        { value: 100000, label: "最近" },
        { value: 250, label: "250m" },
        { value: 500, label: "500m" },
        { value: 1000, label: "1000m" },
      ],
      selectSourceLayer: [],
      aroundOption,
      aroundSourceAnalyseList: [],
      //  filter
      filterKey: ["永久固定码", "唯一码", "分类代码"],
      //  展开条目
      activeNames: undefined,
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
        const { lng, lat } = forceEntity;
        //  周边分析画圆
        aroundSourceAnalyseCircle(lng, lat, RANGE_DISTANCE);
        //  周边分析画点
        this.fetchSourceAround(lng, lat);
      });
      this.$bus.$off("cesium-3d-around-analyse-clear");
      this.$bus.$on("cesium-3d-around-analyse-clear", () => {
        this.closeAroundSourceAnalyse();
      });
    },
    /**
     * 获取周边分析圈,执行周边分析
     * @param {object} forceEntity 分析点
     */
    fetchSourceAround(lng, lat) {
      const aroundSourceAnalyseObj = {};
      const aroundSourceAnalyseList = [];
      //  统一清除 circle label icon
      aroundOption.map(({ value }) => initPrimitivesCollection(value));
      //  周边分析
      Promise.all(
        aroundOption
          .filter((v) => ~this.selectSourceLayer.indexOf(v.value))
          .map(({ label, value }) => {
            return this.fetchSourceSingle(lng, lat, value, label);
          })
      ).then((result) => {
        result.map(({ data, value, label }) => {
          let list = data
            .map((v) => {
              return { ...v, distance: parseFloat(v.distance) };
            })
            .sort(arrayCompareWithParam("distance"));
          if (this.aroundDistance[value] == 100000) {
            list = list.slice(0, 3);
          }
          const sourceAnalyseResult = {
            title: label,
            key: value,
            list,
            node: CESIUM_TREE_AROUND_ANALYSE_OPTION.children.filter(
              ({ resourceType }) => resourceType == value
            )[0],
          };
          aroundSourceAnalyseObj[value] = sourceAnalyseResult;
          //  周边分析画点
          aroundSourceAnalyseDraw(sourceAnalyseResult);
        });
        for (let k in aroundSourceAnalyseObj) {
          aroundSourceAnalyseList.push(aroundSourceAnalyseObj[k]);
        }
        this.aroundSourceAnalyseList = aroundSourceAnalyseList;
        this.activeNames = aroundSourceAnalyseList[0].title;
      });
    },
    /**
     * 逐个获取 * 为保证现实顺序一致
     * @param {number} lng
     * @param {number} lat
     * @param {string} value 标识
     * @param {string} label 名称
     */
    fetchSourceSingle(lng, lat, value, label) {
      return new Promise(async (resolve) => {
        const { data } = await getAroundSourceAnalyse({
          resourceType: value,
          lng,
          lat,
          distance: this.aroundDistance[value],
        });
        resolve({ data, value, label });
      });
    },
    initSelectSourceLayer() {
      this.selectSourceLayer = aroundOption
        .map((v) => v.value)
        .filter((v) => v != "fire_hydrant");
    },
    //  重新分析
    sourceUpdateHandler() {
      const { lng, lat } = this.forceEntity;
      this.fetchSourceAround(lng, lat);
    },
    //  重新分析
    distanceUpdateHandler() {
      const { lng, lat } = this.forceEntity;
      this.fetchSourceAround(lng, lat);
    },
    //  点击单个点位
    forceAnalyseSingle(key, item) {
      const KEY = `eventAround_${key}`;
      const point = window.featureMap[KEY][item.originalData.fieldValues[0]];
      const { x, y } = point.geometry;
      this.$bus.$emit("cesium-3d-pick-to-locate", {
        ...point,
        position: new Cesium.Cartesian3.fromDegrees(x, y, 4),
      });
      window.earth.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(x, y - 0.005, 450),
        orientation: {
          heading: 0.003336768850279448,
          pitch: -0.5808830390057418,
          roll: 0.0,
        },
        maximumHeight: 450,
        duration: 1,
      });
    },
    //  关闭周边分析
    closeAroundSourceAnalyse() {
      aroundOption.map(({ value }) => initPrimitivesCollection(value));
      aroundSourceAnalyseCircleClear();
      this.forceEntity = undefined;
      this.selectSourceLayer = [];
      this.aroundSourceAnalyseList = [];
      this.$bus.$emit("cesium-3d-navigation-clear");
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./AroundSourceAnalyse.less");
</style>
