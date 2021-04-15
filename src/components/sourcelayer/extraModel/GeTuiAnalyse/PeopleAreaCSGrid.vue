<template>
  <div class="people-area-cs-grid">
    <GetGeohashByCodeForGrid
      ref="codeForGrid"
      :BUS_EVENT_TAG="BUS_EVENT_TAG_GRID_CODE"
      :isLoading="isGridCodeLoading"
    />
  </div>
</template>

<script>
const _TAG_ = "getui_car_line_speed_";
import { getRoadsData } from "api/getuiAPI";
import { gcj02towgs84 } from "common/js/coordinateTransfer";

import { ServiceUrl, GridURL } from "config/server/mapConfig";
import { getHeatMapByRanges } from "api/getuiAPI";
import { doGridMap, doGridLabel } from "./tools/GridCSMap";
import GetGeohashByCodeForGrid from "./components/GetGeohashByCodeForGrid";
const LAYERS = ServiceUrl.WZBaimo_OBJ;
const _GRIDMAP_INDEX_ = "getui_gridmap_index";
const _GRIDLABEL_INDEX_ = "getui_gridlabel_index";
const BUS_EVENT_TAG_GRID_CODE = "cesium-getui-area-grid-code";
const BUS_EVENT_TAG_CLICK = "cesium-getui-area-grid-click";

export default {
  name: "PeopleAreaCSGrid",
  data() {
    return {
      BUS_EVENT_TAG_GRID_CODE,
      isGridCodeLoading: false,
      roadIds: [],
    };
  },
  components: { GetGeohashByCodeForGrid },
  async created() {
    this.initS3MScene();
    const { data } = await getRoadsData();
    this.doCountRoute(data);
  },
  async mounted() {
    this.eventRegsiter();
    await this.initGridMap(
      this.$refs.codeForGrid.streetCode || this.$refs.codeForGrid.areaCode
    );
  },
  beforeDestroy() {
    this.resetAreaGrid();
    this.resetS3MScene();
    this.resetRoads();
  },
  methods: {
    eventRegsiter() {
      this.$bus.$off(BUS_EVENT_TAG_GRID_CODE);
      this.$bus.$on(BUS_EVENT_TAG_GRID_CODE, (code) => this.initGridMap(code));
      this.$bus.$off(BUS_EVENT_TAG_CLICK);
      this.$bus.$on(BUS_EVENT_TAG_CLICK, (obj) => {
        this.doLabelGrid(obj);
      });
    },
    initS3MScene() {
      // LAYERS.map(({ KEY }) => {
      //   window.earth.scene.layers.find(KEY).visible = false;
      // });
    },
    /**
     * 初始化网格场景
     * @param {number} code 区域编码
     */
    async initGridMap(code) {
      this.resetAreaGrid();
      try {
        this.isGridCodeLoading = true;
        this.getAreaGeometryByCode(code.slice(0, 9), async (res) => {
          const ranges = [];
          res.result.features.map((item, i) => {
            ranges.push({
              id: item.attributes.NAME,
              center: res.originResult.features[i].geometry.center,
              list: res.originResult.features[i].geometry.points.map((v) => [
                v.x,
                v.y,
              ]),
            });
          });
          await this.doAreaGridWithFragments(ranges, code);
          // this.doCameraMove(data.heatmap[parseInt(data.heatmap.length / 2)]);
        });
      } catch (e) {
      } finally {
      }
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
      const fragmentLength = 50;
      ranges.map((item, i) => {
        const index = parseInt(i / fragmentLength);
        if (!fragments[index]) fragments[index] = [];
        fragments[index].push(item);
      });
      //  clear extra primitivemap
      window.extraPrimitiveMap[
        _GRIDMAP_INDEX_
      ] = window.earth.scene.primitives.add(new Cesium.PrimitiveCollection());
      //  do grid draw [async]
      // for (let i = 0; i < fragments.length; i++) {}
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
              item.map((v) =>
                doGridMap(
                  { ...v, count: hash[v.id] },
                  _GRIDMAP_INDEX_,
                  BUS_EVENT_TAG_CLICK
                )
              );
              resolve(true);
            })
        )
      ).then((res) => {
        console.log(res);
        this.isGridCodeLoading = false;
      });
    },
    /**
     * 展示标签
     */
    doLabelGrid(obj) {
      doGridLabel(obj, _GRIDLABEL_INDEX_);
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
    /**
     * 画道路
     * @param {array} lines 道路数组
     */
    doCountRoute(lines) {
      const linePoints = lines.map(({ path }) =>
        path.map(([x, y]) => gcj02towgs84(x, y).concat([4]))
      );
      this.roadIds = linePoints.map((v, index) => {
        const singeLine = v.reduce((a, b) => a.concat(b));
        const tag = _TAG_ + lines[index].road_id + index;
        window.earth.entities.add({
          name: lines[index].name,
          id: tag,
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(singeLine),
            width: lines[index].type > 40 ? 3 : lines[index].num > 20 ? 12 : 20,
            material: new Cesium.PolylineTrailLinkMaterialProperty(
              lines[index].speed < 15
                ? Cesium.Color.INDIANRED
                : lines[index].speed < 30
                ? Cesium.Color.ORANGE
                : Cesium.Color.LIGHTGREEN,
              (1 / lines[index].speed) * 250000
            ),
          },
        });
        return tag;
      });
    },
    resetRoads() {
      this.roadIds.map((v) => window.earth.entities.removeById(v));
      this.roadIds = [];
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
    resetS3MScene() {
      // LAYERS.map(({ KEY }) => {
      //   window.earth.scene.layers.find(KEY).visible = true;
      // });
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
