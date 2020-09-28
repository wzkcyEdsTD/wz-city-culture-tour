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
            <span>{{ year }}年</span>
          </div>
          <div class="number">
            <DynamicNum :value="indexData.地区GDP" />
            <Compare :data="indexData.rate.地区GDP" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/规上工业企业数.png" />
        <div>
          <div class="title">
            第一产业增加值
            <span class="small">(亿元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>{{ year }}年</span>
          </div>
          <div class="number">
            <DynamicNum :value="indexData.第一产业增加值" />
            <Compare :data="indexData.rate.第一产业增加值" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/固定资产投资累计增速.png" />
        <div>
          <div class="title">
            第二产业增加值
            <span class="small">(亿元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>{{ year }}年</span>
          </div>
          <div class="number">
            <DynamicNum :value="indexData.第二产业增加值" />
            <Compare :data="indexData.rate.第二产业增加值" />
          </div>
        </div>
      </li>
      <li class="item">
        <img
          src="/static/images/index/city/数字经济核心产业制造业增加值增速.png"
        />
        <div>
          <div class="title">
            工业增加值
            <span class="small">(亿元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>{{ year }}年</span>
          </div>
          <div class="number">
            <DynamicNum :value="indexData.工业增加值" />
            <Compare :data="indexData.rate.工业增加值" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/社会消费品零售总额累计增速.png" />
        <div>
          <div class="title">
            第三产业增加值
            <span class="small">(亿元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>{{ year }}年</span>
          </div>
          <div class="number">
            <DynamicNum :value="indexData.第三产业增加值" />
            <Compare :data="indexData.rate.第三产业增加值" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/规上工业企业数.png" />
        <div>
          <div class="title">
            一般公共预算收入
            <span class="small">(亿元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>{{ year }}年</span>
          </div>
          <div class="number">
            <DynamicNum :value="indexData.一般公共预算收入" />
            <Compare :data="indexData.rate.一般公共预算收入" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/规上工业增加值.png" />
        <div>
          <div class="title">
            社会消费品零售总额
            <span class="small">(亿元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>{{ year }}年</span>
          </div>
          <div class="number">
            <DynamicNum :value="indexData.社会消费品零售总额" />
            <Compare :data="indexData.rate.社会消费品零售总额" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/city/规上工业用电量.png" />
        <div>
          <div class="title">
            全市人口
            <span class="small">(万人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>{{ year }}年</span>
          </div>
          <div class="number">
            <DynamicNum :value="indexData.全市人口" />
            <Compare :data="indexData.rate.全市人口" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import INDEX from "./index.json";
import INDEX_LAST from "./indexLastYear.json";
import DynamicNum from "../dynamicNum";
import Compare from "./compare";
export default {
  name: "cityIndex",
  data() {
    return {
      year: "2018",
    };
  },
  computed: {
    indexData() {
      const index = {
        ...INDEX.filter((v) => v.年份 == this.year)[0],
        rate: {},
      };
      Object.keys(INDEX_LAST).map((k) => {
        index.rate[k] = (
          (parseFloat(index[k]) / parseFloat(INDEX_LAST[k])) * 100 -
          100
        ).toFixed(2);
      });
      return index;
    },
  },
  components: { DynamicNum, Compare },
  methods: {},
};
</script>
