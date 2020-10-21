<template>
  <div class="target-wrapper">
    <span class="header">文化体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            博物馆（纪念馆）数量
            <span class="small">(个)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzCultureData['博物馆（纪念馆）数量和分布']" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市百名优秀体育指导员
            <span class="small">(人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzCultureData.全市百名优秀体育指导员" decimals="0"/>
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            社会体育指导员总人数
            <span class="small">(人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzCultureData.社会体育指导员总人数" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            文化驿站数量和分布
            <span class="small">(个)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzCultureData.文化驿站数量和分布" decimals="0" />
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
    ...mapGetters("map", ["WzCultureData"]),
  },
  async created() {
    await this.fetchCultureData();
  },
  methods: {
    ...mapActions("map", ["SetWzCultureData"]),
    /**
     * 概览数据
     */
    async fetchCultureData() {
      await this.SetWzCultureData();
    },
  },
};
</script>
