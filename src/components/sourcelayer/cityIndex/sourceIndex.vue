<template>
  <div class="target-wrapper">
    <span class="header">资源数据</span>
    <ul class="content" v-if="Object.keys(WzSourceData).length">
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            万元GDP用水量
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">{{WzSourceData.万元GDP用水量}}</div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            用水总量
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">{{WzSourceData.用水总量}}</div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            水资源总量
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">{{WzSourceData.水资源总量}}</div>
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
    ...mapGetters("map", ["WzSourceData"]),
  },
  async created() {
    await this.fetchSourceData();
  },
  methods: {
    ...mapActions("map", ["SetWzSourceData"]),
    /**
     * 概览数据
     */
    async fetchSourceData() {
      await this.SetWzSourceData();
    },
  },
};
</script>
