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
            <span>{{ value.resourceName }}</span>
            <span>距离:{{ (+value.distance).toFixed(2) }}米</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { CESIUM_TREE_AROUND_ANALYSE_OPTION } from "config/server/sourceTreeOption";
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
      forceEntity: { lng: 120.654218, lat: 28.016064 },
      distance: 250,
      distanceOption: [
        { value: 250, label: "250m" },
        { value: 500, label: "500m" },
        { value: 1000, label: "1000m" },
      ],
      selectSourceLayer: [],
      aroundOption,
      aroundSourceAnalyseList: [
        // { title: "list1",value:"" list: [] }, 字段样例
      ],
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
    this.fetchSourceAround(this.forceEntity);
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
    optionUpdateHandler() {
      console.log(this.selectSourceLayer);
    },
    /**
     * 获取周边分析圈,执行周边分析
     * @param {object} forceEntity 分析点
     */
    fetchSourceAround(forceEntity) {
      const { lng, lat } = forceEntity;
      const distance = this.distance;
      const aroundSourceAnalyseList = [];
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
          aroundSourceAnalyseList.push({ title: label, list: data });
        });
      this.aroundSourceAnalyseList = aroundSourceAnalyseList;
    },
    initSelectSourceLayer() {
      this.selectSourceLayer = aroundOption.map((v) => v.value);
    },
    //
    sourceUpdateHandler() {},
    //
    distanceUpdateHandler() {},
    //  关闭周边分析
    closeAroundSourceAnalyse() {
      this.forceEntity = undefined;
      this.selectSourceLayer = [];
      this.aroundSourceAnalyseList = [];
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./AroundSourceAnalyse.less");
</style>
