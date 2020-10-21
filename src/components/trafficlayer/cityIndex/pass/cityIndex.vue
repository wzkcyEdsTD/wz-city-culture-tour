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
            <span class="small">(万元)</span>
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
    <ChartsFrame />
    <div class="year-slider">
      <vue-slider
        v-model="year"
        :min="2010"
        :max="2019"
        :interval="1"
        :tooltip="'always'"
        :marks="marks"
      />
      <div class="slider-next" @click="sliderToNextYear">
        <img src="/static/images/common/slider-next@2x.png" />
        <p>年份切换</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagesURL, ServiceUrl } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
import ChartsFrame from "./chartsFrame";
import INDEX from "./index.json";
const INDEX_LAST = INDEX[INDEX.length - 1];
import DynamicNum from "../dynamicNum";
import Compare from "./compare";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
export default {
  name: "cityIndex",
  data() {
    return {
      year: 2018,
      lastImage: "datalayer",
      marks: {
        2010: {},
        2011: {},
        2012: {
          labelStyle: {
            border: "2px dashed gold",
          },
        },
        2013: {},
        2014: {
          labelStyle: {
            border: "2px dashed gold",
          },
        },
        2015: {},
        2016: {},
        2017: {
          labelStyle: {
            border: "2px dashed gold",
          },
        },
        2018: {
          labelStyle: {
            border: "2px dashed gold",
          },
        },
        2019: {
          labelStyle: {
            border: "2px dashed gold",
          },
        },
      },
    };
  },
  watch: {
    year: {
      handler(n, o) {
        this.getYearIndex(n);
      },
      immediate: true,
    },
    nightMode(n) {
      this.$bus.$emit("cesium-3d-switch", { value: n });
    },
  },
  computed: {
    ...mapGetters("map", ["nightMode"]),
    indexData() {
      const index = {
        ...INDEX.filter((v) => v.年份 == this.year)[0],
        rate: {},
      };
      Object.keys(INDEX_LAST).map((k) => {
        index.rate[k] = (
          (parseFloat(INDEX_LAST[k]) / parseFloat(index[k])) * 100 -
          100
        ).toFixed(2);
      });
      return index;
    },
  },
  created() {
    //  事件绑定
    this.eventRegsiter();
    //  切换模式
    this.SetNightMode(true);
    //  关白模
    this.baimoSwitcher(false);
    //  关底图
    window.datalayer && (window.datalayer.show = false);
    window.earth.scene.bloomEffect.show = false;
    //  图表初始化
    this.echartInit();
  },
  beforeDestroy() {
    //  关历史影像
    Object.keys(window.passImages).map(
      (key) => (window.passImages[key].show = false)
    );
    //  开底图
    window.datalayer && (window.datalayer.show = true);
    window.earth.scene.bloomEffect.show = true;
    //  开白模
    this.baimoSwitcher(true);
  },
  components: { DynamicNum, Compare, VueSlider, ChartsFrame },
  methods: {
    ...mapActions("map", ["SetNightMode"]),
    eventRegsiter() {
      this.$bus.$off("cesium-3d-switch-pass");
      this.$bus.$on("cesium-3d-switch-pass", () => {
        //  关白模
        this.baimoSwitcher(false);
        //  关底图
        window.datalayer && (window.datalayer.show = false);
        window.earth.scene.bloomEffect.show = false;
      });
    },
    /**
     * 年份切换
     */
    sliderToNextYear() {
      this.year = this.year == 2019 ? 2010 : this.year + 1;
    },
    /**
     * 获得影像图年份下标
     * @param {number} year 年份
     */
    getYearIndex(year) {
      let _year_ = 2012;
      if (year <= 2012) {
        _year_ = 2012;
      } else if (year <= 2014 && year > 2012) {
        _year_ = 2014;
      } else if (year <= 2017 && year > 2014) {
        _year_ = 2017;
      } else {
        _year_ = year;
      }
      this.exchangeYear(_year_);
    },
    /**
     * 切换历史影像图
     * @param {number} _year_ 年份
     */
    exchangeYear(_year_) {
      !window.passImages && (window.passImages = {});
      ImagesURL.map(({ year, url }) => {
        if (_year_ == year) {
          window.passImages[year]
            ? (window.passImages[year].show = true)
            : (window.passImages[
                year
              ] = window.earth.imageryLayers.addImageryProvider(
                new Cesium.SuperMapImageryProvider({ url })
              ));
        } else {
          window.passImages[year]
            ? (window.passImages[year].show = false)
            : undefined;
        }
      });
    },
    /**
     * 切换白模
     * @param {boolean} boolean 开关
     */
    baimoSwitcher(boolean) {
      ServiceUrl.WZBaimo_OBJ.map(({ KEY }) => {
        const _LAYER_ = window.earth.scene.layers.find(KEY);
        _LAYER_.visible = boolean;
      });
    },
    /**
     * 图表初始化
     */
    echartInit() {},
  },
};
</script>

<style lang="less">
.year-slider {
  position: fixed;
  height: 6.2vh;
  width: 92vh;
  bottom: 10vh;
  left: 50%;
  box-sizing: border-box;
  padding: 1.4vh 9vh 3vh 4vh;
  transform: translateX(-50%);
  background-image: url("/static/images/common/slider-bg.png");
  background-size: 100% 100%;
  .slider-next {
    width: 5.2vh;
    position: absolute;
    right: 12px;
    top: 8px;
    text-align: center;
    cursor: pointer;
    > img {
      height: 3.2vh;
    }
    > p {
      font-size: 1vh;
      color: white;
    }
  }
}
.vue-slider-rail {
  background-color: unset !important;
}
.vue-slider-ltr {
  height: 0.7vh !important;
  padding: 0.6vh 0!important;
  cursor: pointer;
}
.vue-slider-process {
  background: linear-gradient(to right, transparent, #3498db) !important;
}
.vue-slider-dot-handle {
  background-image: url("/static/images/common/slider-point.png");
  background-size: 100% 100%;
  width: 3.4vh;
  height: 3.4vh;
  transform: translate(-10px, -8px);
  background-color: unset !important;
  box-shadow: unset !important;
}
.vue-slider-ltr .vue-slider-mark {
  margin-top: 3px;
  font-weight: 700;
  font-family: DIN !important;
  color: white;
}
.vue-slider-ltr .vue-slider-mark-label {
  margin-top: 0.6vh;
  font-size: 1.6vh;
  padding: 2px 4px;
}
.vue-slider-ltr .vue-slider-mark-label-image {
  border: 2px dashed gold;
}
.vue-slider-dot-tooltip-inner {
  padding: 6px 10px !important;
  font-family: DIN !important;
  font-weight: bold;
  font-size: 2.4vh !important;
  // background-image: url("/static/images/common/slider-pop.png");
  // background-size: 100% 100%;
}
</style>
