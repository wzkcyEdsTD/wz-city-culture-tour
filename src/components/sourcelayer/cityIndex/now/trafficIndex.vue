<template>
  <div class="target-wrapper">
    <div class="traffic-top" v-if="isTraffic">
      <img src="/static/images/common/traffic-top@2x.png" />
    </div>
    <span class="header">交通体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/traffic/高速收费站入口总量.png" />
        <div>
          <div class="title">
            道路车辆总数
            <span class="small">(辆)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当前</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTrafficData.vehicle_count" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/traffic/高速收费站出口总量.png" />
        <div>
          <div class="title">
            主城区车辆数
            <span class="small">(辆)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当前</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTrafficData.urban_area_car_num" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/traffic/高速公路收费站流量总量.png" />
        <div>
          <div class="title">
            高速路段车流速
            <span class="small">(公里/小时)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当前</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTrafficData.highway_speed" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/traffic/道路客运发客总量.png" />
        <div>
          <div class="title">
            主干路段车流速
            <span class="small">(公里/小时)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTrafficData.mainway_speed" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { parseQueryString } from "common/js/util";
import DynamicNum from "../dynamicNum";

export default {
  name: "trafficIndex",
  components: { DynamicNum },
  computed: {
    ...mapGetters("map", ["WzTrafficData"]),
    isTraffic() {
      const query = parseQueryString(window.location.href);
      return query.traffic;
    },
  },
  async created() {
    await this.fetchTrafficData();
  },
  methods: {
    ...mapActions("map", ["SetTrafficData"]),
    /**
     * 概览数据
     */
    async fetchTrafficData() {
      await this.SetTrafficData();
    },
  },
};
</script>

<style lang="less" scoped>
.traffic-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  > img {
    width: 100%;
  }
}
</style>
