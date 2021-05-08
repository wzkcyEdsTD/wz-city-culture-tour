<template>
  <div class="people-area-heat">
    <GetGeohashByGeometry
      :BUS_EVENT_TAG="BUS_EVENT_TAG_HEAT_DRAW"
      :isLoading="isHeatDrawLoading"
    />
    <GetGeohashByCode
      :BUS_EVENT_TAG="BUS_EVENT_TAG_HEAT_CODE"
      :isLoading="isHeatCodeLoading"
    />
  </div>
</template>

<script>
import { GridURL, StreetURL } from "config/server/mapConfig";
import {
  getHeatMapByCode,
  getHeatMapByGeometry,
  getHeatMapByRanges,
  getRoadsData,
} from "api/getuiAPI";
import { doHeatMap } from "./tools/HeatMap";
import { doCountRoute, doRoadLabel } from "./tools/GridCsRoad";
import {
  doGridPolygon,
  doGridLabelWithoutColor,
  doGridWall,
} from "./tools/GridCSMap";
import GetGeohashByCode from "./components/GetGeohashByCode";
import GetGeohashByGeometry from "./components/GetGeohashByGeometry";
const _HEATMAP_INDEX_ = "getui_heatmap_index";
const _HEATMAP_GRID_INDEX_ = "getui_heatmap_grid_index";
const _HEATMAP_GRIDLABEL_INDEX_ = "getui_heatmap_gridlabel_index";
const _HEATMAP_ROAD_INDEX_ = "getui_heatmap_road_index";
const _HEATMAP_ROADLABEL_INDEX_ = "getui_heatmap_roadlabel_index";
const BUS_EVENT_TAG_HEAT_CODE = "cesium-getui-area-heat-code";
const BUS_EVENT_TAG_HEAT_DRAW = "cesium-getui-area-heat-draw";
const BUS_EVENT_TAG_CLICK = "cesium-getui-area-grid-click";
const BUS_EVENT_TAG_ROAD_CLICK = "cesium-getui-area-road-click";
const WALL_ID = "CESIUM_PEOPLE_GRID_WALL";

export default {
  name: "PeopleAreaHeat",
  data() {
    return {
      BUS_EVENT_TAG_HEAT_CODE,
      BUS_EVENT_TAG_HEAT_DRAW,
      isHeatCodeLoading: false,
      isHeatDrawLoading: false,
      roadIds: [],
      gridHash: {},
    };
  },
  components: { GetGeohashByCode, GetGeohashByGeometry },
  async created() {
    await this.initHeatMap();
    await this.doRoadInit();
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.resetAreaHeat();
    this.resetAreaGrid();
    this.resetRoads();
    this.resetWall();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off(BUS_EVENT_TAG_HEAT_CODE);
      this.$bus.$on(BUS_EVENT_TAG_HEAT_CODE, (code) => this.initHeatMap(code));
      this.$bus.$off(BUS_EVENT_TAG_HEAT_DRAW);
      this.$bus.$on(BUS_EVENT_TAG_HEAT_DRAW, (ranges) =>
        this.initHeatMapByGeometry(ranges)
      );
      this.$bus.$off(BUS_EVENT_TAG_CLICK);
      this.$bus.$on(BUS_EVENT_TAG_CLICK, (obj) => {
        this.doLabelGrid(obj);
      });
      this.$bus.$off(BUS_EVENT_TAG_ROAD_CLICK);
      this.$bus.$on(BUS_EVENT_TAG_ROAD_CLICK, (obj) => {
        this.doLabelRoad(obj);
      });
    },
    async initHeatMap(code = "330302") {
      this.resetAreaHeat();
      this.resetAreaGrid();
      this.resetWall();
      try {
        this.isHeatCodeLoading = true;
        const { data } = await getHeatMapByCode(code);
        // this.doCameraMove(data.heatmap[parseInt(data.heatmap.length / 2)]);
        this.doAreaHeat(data);
        //  全市域查不了
        if (code == "300300") {
          this.isHeatCodeLoading = false;
        } else {
          this.initStreetGrid(code);
        }
      } catch (e) {
      } finally {
      }
    },
    async doRoadInit() {
      const { data } = await getRoadsData();
      this.roadIds = doCountRoute(
        data,
        _HEATMAP_ROAD_INDEX_,
        BUS_EVENT_TAG_ROAD_CLICK
      );
    },
    async initHeatMapByGeometry(ranges) {
      this.resetAreaHeat();
      try {
        this.isHeatDrawLoading = true;
        const { data } = await getHeatMapByGeometry(ranges);
        this.doCameraMove(data.heatmap[parseInt(data.heatmap.length / 2)]);
        this.doAreaHeat(data);
      } catch (e) {
      } finally {
        this.isHeatDrawLoading = false;
      }
    },
    /**
     * 画热力图
     * @param {array} points 热力图点
     */
    doAreaHeat({ heatmap }) {
      window.extraPrimitiveMap[_HEATMAP_INDEX_] = doHeatMap(heatmap);
    },
    async initStreetGrid(code) {
      const isGrid = code.length > 6;
      //  获取街道、网格面
      const res = await this.getStreetAreaGeometryByCode(
        code.slice(0, 9),
        isGrid
      );
      const ranges = [];
      res.result.features.map((item, i) => {
        const id = item.attributes.FNAME || item.attributes.NAME;
        id &&
          ranges.push({
            id,
            center: res.originResult.features[i].geometry.center,
            list: res.originResult.features[i].geometry.points.map((v) => [
              v.x,
              v.y,
            ]),
          });
      });
      //  画街道、网格面，并查询热力做标注
      await this.doAreaGridWithFragments(ranges, code, isGrid);
    },
    /**
     * street&grid fetch
     * @param {object} code
     * @param {boolean} mode true 街道 false 网格
     * @param {function} fn callback hook
     */
    getStreetAreaGeometryByCode(code, isGrid = false) {
      return new Promise((resolve, reject) => {
        const dataSource = isGrid ? GridURL : StreetURL;
        const SQL = "ADCODE like '%" + code + "%'";
        var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
        getFeatureParam = new SuperMap.REST.FilterParameter({
          attributeFilter: SQL,
        });
        getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
          queryParameter: getFeatureParam,
          toIndex: -1,
          datasetNames: dataSource.dataSource,
        });
        getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
          dataSource.url,
          {
            eventListeners: {
              processCompleted: async (res) => resolve(res),
              processFailed: (msg) => reject(msg),
            },
          }
        );
        getFeatureBySQLService.processAsync(getFeatureBySQLParams);
      });
    },
    /**
     * 画热力图
     * @param {array} points 热力图点
     */
    async doAreaGridWithFragments(ranges, area_code, isGrid) {
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
        _HEATMAP_GRID_INDEX_
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
                doGridPolygon(
                  { ...v, count: hash[v.id] },
                  _HEATMAP_GRID_INDEX_,
                  BUS_EVENT_TAG_CLICK
                );
                // !isGrid &&
                this.doLabelGrid(
                  { ...v, count: hash[v.id], ...v.center },
                  !isGrid
                );
              });
              resolve(true);
            })
        )
      ).then((res) => {
        this.isHeatCodeLoading = false;
      });
    },
    /**
     * 展示标签
     */
    doLabelGrid(obj, withoutDistance = false) {
      doGridLabelWithoutColor(obj, _HEATMAP_GRIDLABEL_INDEX_, withoutDistance);
      doGridWall(obj, this, WALL_ID);
    },
    doLabelRoad(obj) {
      doRoadLabel(obj, _HEATMAP_ROADLABEL_INDEX_);
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
    //  清除图层
    resetAreaHeat() {
      if (window.extraPrimitiveMap[_HEATMAP_INDEX_]) {
        window.earth.entities.removeById(
          window.extraPrimitiveMap[_HEATMAP_INDEX_]._layer.id
        );
        delete window.extraPrimitiveMap[_HEATMAP_INDEX_];
      }
    },
    //  清除道路
    resetRoads() {
      this.roadIds.map((v) => window.earth.entities.removeById(v));
      this.roadIds = [];
      if (window.extraPrimitiveMap[_HEATMAP_ROADLABEL_INDEX_]) {
        window.extraPrimitiveMap[_HEATMAP_ROADLABEL_INDEX_].removeAll();
        delete window.extraPrimitiveMap[_HEATMAP_ROADLABEL_INDEX_];
      }
    },
    //  清除图层
    resetAreaGrid() {
      if (window.extraPrimitiveMap[_HEATMAP_GRID_INDEX_]) {
        window.extraPrimitiveMap[_HEATMAP_GRID_INDEX_].removeAll();
        delete window.extraPrimitiveMap[_HEATMAP_GRID_INDEX_];
      }
      if (window.extraPrimitiveMap[_HEATMAP_GRIDLABEL_INDEX_]) {
        window.extraPrimitiveMap[_HEATMAP_GRIDLABEL_INDEX_].removeAll();
        delete window.extraPrimitiveMap[_HEATMAP_GRIDLABEL_INDEX_];
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
.people-area-heat {
  position: fixed;
  top: 20vh;
  right: 4vh;
  z-index: 2;
}
</style>
