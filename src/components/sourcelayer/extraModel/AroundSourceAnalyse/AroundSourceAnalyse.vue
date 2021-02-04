<template>
  <div class="around-source-analyse">
    <span class="header">周边分析<i @click="closeAroundSourceAnalyse">x</i></span>
    <div class="around-source-pick">
      <el-select v-model="value1" multiple placeholder="请选择">
        <el-option
          v-for="item in options"
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

export default {
  name: "aroundSourceAnalyse",
  data() {
    return {
      aroundOption: [
        { value: "option1", label: "option1" },
        { value: "option2", label: "option2" },
        { value: "option3", label: "option3" },
        { value: "option4", label: "option4" },
      ],
      aroundSourceAnalyseList: [
        { title: "list1", list: [] },
        { title: "list1", list: [] },
        { title: "list1", list: [] },
        { title: "list1", list: [] },
      ],
    };
  },
  computed: {
    ...mapGetters("map", []),
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    //  执行周边分析
    doAroundSourceAnalyse() {},
    //  获取周边分析圈
    async fetchSourceAround() {
      const { LON, LAT } = this.eventForce;
      const geometry = SuperMap.Geometry.Polygon.createRegularPolygon(
        new SuperMap.Geometry.Point(LON, LAT),
        (250 / (2 * Math.PI * 6371000)) * 360,
        30,
        0
      );
      //  周边分析
      CESIUM_TREE_SOURCE_OPTION[0].children.map(async ({ newdataset, label, url }) => {
        this.sourceAround[label] = await this.fetchFromDataSets(
          geometry,
          newdataset,
          url
        );
      });
    },
    //  获取数据集点位
    fetchFromDataSets(geometry, newdataset, url) {
      return new Promise((resolve, reject) => {
        const getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
          url,
          {
            eventListeners: {
              processCompleted: (data) => data && resolve(data.originResult.totalCount),
              processFailed: (err) => reject(err),
            },
          }
        );
        getFeaturesByGeometryService.processAsync(
          new SuperMap.REST.GetFeaturesByGeometryParameters({
            datasetNames: [newdataset],
            geometry,
            returnCountOnly: true,
            toIndex: 0,
          })
        );
      });
    },
    //  关闭周边分析
    closeAroundSourceAnalyse() {},
  },
};
</script>

<style lang="less" scoped>
@import url("./AroundSourceAnalyse.less");
</style>
