<template>
  <div class="target-wrapper">
    <span class="header">城市体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/city/地区生产总值.png" />
        <div>
          <div class="title">
            地区GDP
            <span class="small">(亿元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当季度</span>
          </div>
          <div class="number">
            <DynamicNum :value="WzOverviewData.gdp" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/规上工业企业数.png" />
        <div>
          <div class="title">
            全市人口
            <span class="small">(万人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>2019年</span>
          </div>
          <div class="number" v-if="WzOverviewData.people">
            <DynamicNum :value="WzOverviewData.people" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/固定资产投资累计增速.png" />
        <div>
          <div class="title">
            固定资产投资累计增速
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number" v-if="WzOverviewData.固定资产投资累计增速">
            <DynamicNum
              :value="WzOverviewData.固定资产投资累计增速.currentNum"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img
          src="/static/images/index/city/数字经济核心产业制造业增加值增速.png"
        />
        <div>
          <div class="title">
            数字经济核心产业制造业增加值增速
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div
            class="number"
            v-if="WzOverviewData.数字经济核心产业制造业增加值增速"
          >
            <DynamicNum
              :value="
                WzOverviewData.数字经济核心产业制造业增加值增速.currentNum
              "
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/社会消费品零售总额累计增速.png" />
        <div>
          <div class="title">
            社会消费品零售总额累计增速
            <span class="small">(%)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number" v-if="WzOverviewData.社会消费品零售总额累计增速">
            <DynamicNum
              :value="WzOverviewData.社会消费品零售总额累计增速.currentNum"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/规上工业企业数.png" />
        <div>
          <div class="title">
            规上工业企业数
            <span class="small">(家)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number" v-if="WzOverviewData.规上工业">
            <DynamicNum :value="WzOverviewData.规上工业.entNum" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/规上工业增加值.png" />
        <div>
          <div class="title">
            规上工业增加值
            <span class="small">(亿元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number" v-if="WzOverviewData.规上工业">
            <DynamicNum :value="WzOverviewData.规上工业.industryAddValue" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/规上工业用电量.png" />
        <div>
          <div class="title">
            规上工业用电量
            <span class="small">(万千瓦时)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当日</span>
          </div>
          <div class="number" v-if="WzOverviewData.规上工业">
            <DynamicNum :value="WzOverviewData.规上工业.electricity" />
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
  name: "cityIndex",
  components: { DynamicNum },
  computed: {
    ...mapGetters("map", ["WzOverviewData"]),
  },
  async created() {
    await this.fetchWzOverviewData();
  },
  methods: {
    ...mapActions("map", ["SetWzOverviewData"]),
    /**
     * 概览数据
     */
    async fetchWzOverviewData() {
      await this.SetWzOverviewData();
    },
  },
};
</script>
