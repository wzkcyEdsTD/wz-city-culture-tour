<template>
  <div class="around-source-analyse" v-show="forceEntity">
    <span class="header"
      >周边分析
      <i class="around-source-close" @click="closeAroundSourceAnalyse">x</i>
    </span>
    <div class="around-source-pick">
      <el-select
        class="around-source-select"
        v-model="selectSourceLayer"
        multiple
        size="mini"
        :clearable="true"
        placeholder="请选择"
        @change="optionUpdateHandler"
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
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item, index) in aroundSourceAnalyseList"
          :key="index"
          :title="item.title"
        >
          <div
            class="around-source-list-single"
            v-for="(value, subIndex) in item.list"
            :key="subIndex"
          >
            {{ subIndex }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { CESIUM_TREE_AROUND_ANALYSE_OPTION } from "config/server/sourceTreeOption";
import { getAroundSourceAnalyse } from "@/api/cityBrainAPI";
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
      distance: 500,
      selectSourceLayer: [],
      aroundOption,
      aroundSourceAnalyseList: [
        // { title: "list1", list: [] }, 字段样例
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
      //  周边分析
      this.selectSourceLayer.map(async (resourceType) => {
        const result = await getAroundSourceAnalyse({
          resourceType,
          lng,
          lat,
          distance,
        });
        console.log(result);
      });
    },
    //  获取数据集点位
    fetchFromDataSets(geometry, newdataset, url) {
      return new Promise((resolve, reject) => {
        const getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
          url,
          {
            eventListeners: {
              processCompleted: (data) => data && resolve(data.originResult),
              processFailed: (err) => reject(err),
            },
          }
        );
        getFeaturesByGeometryService.processAsync(
          new SuperMap.REST.GetFeaturesByGeometryParameters({
            datasetNames: [newdataset],
            geometry,
            toIndex: -1,
          })
        );
      });
    },
    initSelectSourceLayer() {
      this.selectSourceLayer = aroundOption.map((v) => v.value);
    },
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
