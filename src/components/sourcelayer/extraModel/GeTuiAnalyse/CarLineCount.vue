<template>
  <div class="car-line-count" />
</template>

<script>
const _TAG_ = "getui_car_line_count_";
import { getRoadsData } from "api/getuiAPI";
import { gcj02towgs84 } from "common/js/coordinateTransfer";
export default {
  name: "CarLineCount",
  data() {
    return {
      roadIds: [],
    };
  },
  async created() {
    const { data } = await getRoadsData();
    this.doCountRoute(data);
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.resetRoads();
  },
  methods: {
    eventRegsiter() {},
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
            width: 10,
            material: new Cesium.PolylineTrailLinkMaterialProperty(
              lines[index].num > 40
                ? Cesium.Color.INDIANRED
                : lines[index].num > 20
                ? Cesium.Color.ORANGE
                : Cesium.Color.LIGHTGREEN,
              10000
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
  },
};
</script>

<style lang="less" scoped>
.car-line-count {
}
</style>
