<template>
  <div class="target-wrapper">
    <span class="header">公共专题</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/public/万元gdp用水.png" />
        <div>
          <div class="title">
            万元GDP用水量
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzSourceData.万元GDP用水量" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/public/总用水.png" />
        <div>
          <div class="title">
            用水总量
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzSourceData.用水总量" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/public/水资源.png" />
        <div>
          <div class="title">
            水资源总量
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzSourceData.水资源总量" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/public/工作人口.png" />
        <div>
          <div class="title">
            全市工作人口
            <span class="small">(万人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzSourceData.work_count/10000" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/public/居住人口.png" />
        <div>
          <div class="title">
            全市居住人口
            <span class="small">(万人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzSourceData.home_count/10000" />
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
