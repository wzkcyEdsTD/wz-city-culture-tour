<template>
  <div class="people-area-cs-grid">
    <GetGeohashByCodeForGrid
      ref="codeForGrid"
      :BUS_EVENT_TAG="BUS_EVENT_TAG_GRID_CODE"
      :isLoading="isGridCodeLoading"
    />
    <GetGeohashByLevel
      ref="level"
      :BUS_EVENT_TAG="BUS_EVENT_TAG_GRID_BY_LEVEL"
      :isLoading="isGridCodeLoading"
      :forceLevels="forceLevels"
      :forceLevel="forceLevel"
    />
  </div>
</template>

<script>
import { GridURL } from "config/server/mapConfig";
import { getHeatMapByRanges, getRoadsData } from "api/getuiAPI";
import { doCountRoute, doRoadLabel } from "./tools/GridCsRoad";
import { doGridMap, doGridLabel, doGridWall } from "./tools/GridCSMap";
import GetGeohashByCodeForGrid from "./components/GetGeohashByCodeForGrid";
import GetGeohashByLevel from "./components/GetGeohashByLevel";
const _GRIDMAP_INDEX_ = "getui_gridmap_index";
const _GRIDLABEL_INDEX_ = "getui_gridlabel_index";
const _GRIDROAD_INDEX_ = "getui_gridroad_index";
const _GRIDROADLABEL_INDEX_ = "getui_gridroadlabel_index";
const BUS_EVENT_TAG_GRID_CODE = "cesium-getui-area-grid-code";
const BUS_EVENT_TAG_CLICK = "cesium-getui-area-grid-click";
const BUS_EVENT_TAG_ROAD_CLICK = "cesium-getui-area-road-click";
const BUS_EVENT_TAG_GRID_BY_LEVEL = "cesium-getui-area-grid-by-level";
const WALL_ID = "CESIUM_PEOPLE_GRID_WALL";
const LEVEL_HASH = {
  city: ["area", "street"],
  area: ["street", "estate"],
  street: ["estate", "grid"],
};

export default {
  name: "PeopleAreaCSGrid",
  data() {
    return {
      BUS_EVENT_TAG_GRID_CODE,
      BUS_EVENT_TAG_GRID_BY_LEVEL,
      isGridCodeLoading: false,
      roadIds: [],
      gridHash: {},
      forceLevels: ["street", "estate"],
      forceLevel: "street",
      forceAreaCode: "330302",
    };
  },
  components: { GetGeohashByCodeForGrid, GetGeohashByLevel },
  async created() {
    await this.doRoadInit();
  },
  async mounted() {
    this.eventRegsiter();
    await this.initGridMap(this.forceAreaCode, this.forceLevel);
  },
  beforeDestroy() {
    this.resetAreaGrid();
    this.resetRoads();
    this.resetWall();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off(BUS_EVENT_TAG_GRID_CODE);
      this.$bus.$on(BUS_EVENT_TAG_GRID_CODE, ({ code, mapLevel }) => {
        this.forceAreaCode = code;
        this.forceLevels = LEVEL_HASH[mapLevel];
        this.forceLevel = LEVEL_HASH[mapLevel][0];
        this.$nextTick(() => {
          console.log(code, mapLevel, this.forceLevels, this.forceLevel);
          this.initGridMap(code, this.forceLevel);
        });
      });
      this.$bus.$off(BUS_EVENT_TAG_CLICK);
      this.$bus.$on(BUS_EVENT_TAG_CLICK, (obj) => {
        this.doLabelGrid(obj, true);
      });
      this.$bus.$off(BUS_EVENT_TAG_ROAD_CLICK);
      this.$bus.$on(BUS_EVENT_TAG_ROAD_CLICK, (obj) => {
        this.doLabelRoad(obj);
      });
      this.$bus.$off(BUS_EVENT_TAG_GRID_BY_LEVEL);
      this.$bus.$on(BUS_EVENT_TAG_GRID_BY_LEVEL, (forceLevel) => {
        this.forceLevel = forceLevel;
        this.initGridMap(this.forceAreaCode, forceLevel);
      });
    },
    /**
     * 初始化网格场景
     * @param {number} code 区域编码
     * @param {string} level 分析粒度
     */
    async initGridMap(code, level) {
      this.resetAreaGrid();
      this.resetWall();
      console.log(code, level);
      // try {
      //   this.isGridCodeLoading = true;
      //   this.getAreaGeometryByCode(code.slice(0, 9), async (res) => {
      //     const ranges = [];
      //     res.result.features.map((item, i) => {
      //       item.attributes.NAME &&
      //         ranges.push({
      //           id: item.attributes.NAME,
      //           center: res.originResult.features[i].geometry.center,
      //           list: res.originResult.features[i].geometry.points.map((v) => [
      //             v.x,
      //             v.y,
      //           ]),
      //         });
      //     });
      //     await this.doAreaGridWithFragments(ranges, code);
      //     // this.doCameraMove(data.heatmap[parseInt(data.heatmap.length / 2)]);
      //   });
      // } catch (e) {
      // } finally {
      // }
    },
    async doRoadInit() {
      const { data } = await getRoadsData();
      this.roadIds = doCountRoute(
        data,
        _GRIDROAD_INDEX_,
        BUS_EVENT_TAG_ROAD_CLICK
      );
    },
    /**
     * area fetch
     * @param {object} code
     * @param {function} fn callback hook
     */
    getAreaGeometryByCode(code, fn) {
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: "ADCODE like '%" + code + "%'",
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: GridURL.dataSource,
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
        GridURL.url,
        {
          eventListeners: {
            processCompleted: async (res) => fn(res),
            processFailed: (msg) => console.log(msg),
          },
        }
      );
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    /**
     * 画热力图
     * @param {array} points 热力图点
     */
    async doAreaGridWithFragments(ranges, area_code) {
      const fragments = [];
      const gridHash = {};
      const fragmentLength = 50;
      ranges.map((item, i) => {
        const index = parseInt(i / fragmentLength);
        if (!fragments[index]) fragments[index] = [];
        fragments[index].push(item);
        gridHash[item.id] = item;
      });
      //  clear extra primitivemap
      window.extraPrimitiveMap[
        _GRIDMAP_INDEX_
      ] = window.earth.scene.primitives.add(new Cesium.PrimitiveCollection());
      //  do grid hash
      this.gridHash = gridHash;
      //  do grid draw [async]
      Promise.all(
        fragments.map(
          (item) =>
            new Promise(async (resolve, reject) => {
              const { data } = await getHeatMapByRanges(item, area_code);
              const hash = {};
              data.map(({ id, heatmap }) => {
                hash[id] = 0;
                heatmap.map((d) => (hash[id] += d.count));
              });
              item.map((v) => {
                doGridMap(
                  { ...v, count: hash[v.id] },
                  _GRIDMAP_INDEX_,
                  BUS_EVENT_TAG_CLICK
                );
                this.doLabelGrid({ ...v, count: hash[v.id], ...v.center });
              });
              resolve(true);
            })
        )
      ).then((res) => {
        this.isGridCodeLoading = false;
      });
    },
    /**
     * 展示标签
     */
    doLabelGrid(obj, doWall = false) {
      doGridLabel(obj, _GRIDLABEL_INDEX_);
      doWall && doGridWall(obj, this, WALL_ID);
    },
    doLabelRoad(obj) {
      doRoadLabel(obj, _GRIDROADLABEL_INDEX_);
    },
    /**
     * @param {object} 中间点位
     */
    doCameraMove({ lng, lat }) {
      window.earth.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat - 0.08, 5200),
        orientation: {
          heading: 0.003336768850279448,
          pitch: -0.5808830390057418,
          roll: 0.0,
        },
        maximumHeight: 450,
      });
    },
    //  清除道路
    resetRoads() {
      this.roadIds.map((v) => window.earth.entities.removeById(v));
      this.roadIds = [];
      if (window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_]) {
        window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_].removeAll();
        delete window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_];
      }
    },
    //  清除图层
    resetAreaGrid() {
      if (window.extraPrimitiveMap[_GRIDMAP_INDEX_]) {
        window.extraPrimitiveMap[_GRIDMAP_INDEX_].removeAll();
        delete window.extraPrimitiveMap[_GRIDMAP_INDEX_];
      }
      if (window.extraPrimitiveMap[_GRIDLABEL_INDEX_]) {
        window.extraPrimitiveMap[_GRIDLABEL_INDEX_].removeAll();
        delete window.extraPrimitiveMap[_GRIDLABEL_INDEX_];
      }
    },
    //  清除呼吸灯
    resetWall() {
      window.earth.entities.removeById(WALL_ID);
    },
  },
};
</script>

<style lang="less" scoped>
.people-area-cs-grid {
  position: fixed;
  top: 20vh;
  right: 4vh;
  z-index: 2;
}
</style>
