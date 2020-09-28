<template>
  <div class="target-wrapper">
    <span class="header">旅游体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            3A级景区村数量
            <span class="small">(个)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTourData['3A级景区村数量和分布']" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            星级旅游饭店数量
            <span class="small">(个)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTourData.星级旅游饭店数量和分布" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            非遗项目数量
            <span class="small">(个)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzTourData.非遗项目数量和分布" decimals="0" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DynamicNum from "../dynamicNum";

export default {
  name: "trafficIndex",
  components: { DynamicNum },
  computed: {
    ...mapGetters("map", ["WzTourData"]),
  },
  async created() {
    await this.fetchTourData();
  },
  methods: {
    ...mapActions("map", ["SetWzTourData"]),
    /**
     * 概览数据
     */
    async fetchTourData() {
      await this.SetWzTourData();
    },
  },
};
</script>
