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
            高速收费站入口总量
            <span class="small">(万)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTrafficData.高速收费站入口总量" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/traffic/高速收费站出口总量.png" />
        <div>
          <div class="title">
            高速收费站出口总量
            <span class="small">(万)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTrafficData.高速收费站出口总量" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/traffic/高速公路收费站流量总量.png" />
        <div>
          <div class="title">
            高速公路收费站流量总量
            <span class="small">(万)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTrafficData.高速公路收费站流量总量" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/traffic/道路客运发客总量.png" />
        <div>
          <div class="title">
            道路客运发客总量
            <span class="small">(万)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTrafficData.道路客运发客总量" />
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
    ...mapGetters("traffic", ["WzTrafficData"]),
    isTraffic() {
      const query = parseQueryString(window.location.href);
      return query.traffic;
    },
  },
  async created() {
    await this.fetchTrafficData();
  },
  methods: {
    ...mapActions("traffic", ["SetTrafficData"]),
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
