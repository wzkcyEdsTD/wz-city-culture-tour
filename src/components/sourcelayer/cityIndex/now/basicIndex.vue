<template>
  <div class="target-wrapper">
    <span class="header">基础体征</span>
    <ul class="content" v-if="Object.keys(WzBasicData).length">
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市新建商品住宅可售（待售）套数
            <span class="small">(套)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum
              :value="WzBasicData['全市新建商品住宅可售（待售）套数、可售（待售）面积'].vendibilityTotal"
              decimals="0"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市新建商品住宅可售（待售）面积
            <span class="small">(㎡)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzBasicData['全市新建商品住宅可售（待售）套数、可售（待售）面积'].vendibilityArea" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市每月存量商品住宅成交套数
            <span class="small">(套)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum
              :value="WzBasicData['全市每月存量商品住宅成交套数、成交面积、成交均价'].stockResidenceTotal"
              decimals="0"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市每月存量商品住宅成交面积
            <span class="small">(㎡)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzBasicData['全市每月存量商品住宅成交套数、成交面积、成交均价'].stockResidenceArea" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市每月存量商品住宅成交均价
            <span class="small">(万元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzBasicData['全市每月存量商品住宅成交套数、成交面积、成交均价'].stockResidenceAverage" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/unknowns.png" />
        <div>
          <div class="title">
            全市每月新建商品住宅成交均价
            <span class="small">(万元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzBasicData['全市每月新建商品住宅成交均价'].commercialResidenceAverage" />
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
    ...mapGetters("map", ["WzBasicData"]),
  },
  async created() {
    await this.fetchBasicData();
  },
  methods: {
    ...mapActions("map", ["SetWzBasicData"]),
    /**
     * 概览数据
     */
    async fetchBasicData() {
      await this.SetWzBasicData();
    },
  },
};
</script>
