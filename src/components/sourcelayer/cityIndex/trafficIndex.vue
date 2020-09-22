<template>
  <div class="target-wrapper">
    <span class="header">交通信息</span>
    <ul class="content" v-if="Object.keys(WzTrafficData).length">
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
          <div class="number">{{WzTrafficData.高速收费站入口总量}}</div>
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
          <div class="number">{{WzTrafficData.高速收费站出口总量}}</div>
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
          <div class="number">{{WzTrafficData.高速公路收费站流量总量}}</div>
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
          <div class="number">{{WzTrafficData.道路客运发客总量}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "trafficIndex",
  computed: {
    ...mapGetters("map", ["WzTrafficData"]),
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
