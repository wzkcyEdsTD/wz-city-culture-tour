<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-09-15 10:32:15
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\InfoFrame.vue
-->
<template>
  <div class="bimframe">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
      <div>
        <header>
          <span class="title">{{ attributes.SHORTNAME || "" }}</span>
        </header>
        <section v-for="(item, index) in indexEnums" :key="index">
          <span class="section-title">{{ item.label }}</span>
          <div class="block-outside">
            <div class="block" v-for="(_item, _index) in item.data" :key="_index">
              <table>
                <tbody>
                  <tr>
                    <td>{{ _item.label }}</td>
                    <!-- <td><i class="block-compare">同比昨日</i></td> -->
                  </tr>
                  <tr>
                    <td>
                      <span class="item-num">{{ _item.num || "-" }}</span>
                      <span class="item-unit">{{ _item.unit }}</span>
                    </td>
                    <!-- <td
                      :style="{
                        color: _item.ratio >= 0 ? '#04b72d' : '#fc5453',
                      }"
                    >
                      <span
                        >{{
                          _item.ratio >= 0
                            ? `+${_item.ratio}`
                            : _item.ratio || "-"
                        }}{{ _item.unit }}</span
                      >
                      <i
                        :class="[_item.ratio >= 0 ? 'ratio-up' : 'ratio-down']"
                      ></i>
                    </td> -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="desc-wrapper">
          <span class="section-title">医院简介</span>
          <div>
            <p class="address">地址：{{ attributes.ADDRESS || `暂无地址` }}</p>
            <p class="summary">{{ attributes.SUMMARY || `暂无简介` }}</p>
          </div>
          <div class="imgs">
            <ul>
              <li v-for="(item, index) in imgHash[attributes.SHORTNAME]" :key="index">
                <img :src="`/static/images/医院/${item}`" />
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { imgHash } from "./config";

export default {
  name: "InfoFrame",
  data() {
    return {
      imgHash,
      attributes: {},
      indexEnums: [],
    };
  },
  watch: {
    attributes: {
      handler(n) {
        console.log(n);
        this.indexEnums = [
          {
            label: "今日病情指标",
            data: [
              { label: "发热病人数", num: n.发热病人, ratio: 0, unit: "人" },
              { label: "肿瘤病人数", num: n.肿瘤病人, ratio: 0, unit: "人" },
              {
                label: "传染病人数",
                num: n.当日传染病总数,
                ratio: 0,
                unit: "人",
              },
              {
                label: "实时门诊人次",
                num: n.实时门诊人次,
                ratio: 0,
                unit: "次",
              },
              { label: "急诊床位总数", num: n.应急床位总数, ratio: 0, unit: "张" },
              { label: "急诊床位剩余", num: n.应急床位剩余数, ratio: 0, unit: "张" },
            ],
          },

          {
            label: "今日就诊指标",
            data: [
              {
                label: "门诊费用",
                num: n.门诊费用 ? (n.门诊费用 / 10000).toFixed(2) : 0,
                ratio: 0,
                unit: "万元",
              },
              {
                label: "住院费用",
                num: n.住院费用 ? (n.住院费用 / 10000).toFixed(2) : 0,
                ratio: 0,
                unit: "万元",
              },
              // { label: "住院床位数", num: 0, ratio: 0, unit: "床" },
              { label: "住院人数", num: n.住院人次, ratio: 0, unit: "人" },
            ],
          },
          // {
          //   label: "今日医保指标",
          //   data: [
          //     { label: "医保就医人数", num: 0, ratio: 0, unit: "人" },
          //     { label: "医保支付额", num: 0, ratio: 0, unit: "万元" },
          //   ],
          // },
        ];
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters("map", ["isInfoFrame"]),
  },
  beforeDestroy() {
    this.closeBimFrame();
  },
  mounted() {
    this.$bus.$on("cesium-3d-detail-info-clear", () => {
      this.closeBimFrame();
    });
  },
  methods: {
    ...mapActions("map", ["SetIsInfoFrame"]),
    closeBimFrame() {
      // this.SetIsInfoFrame(false);
      this.$parent.isInfoFrame = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./InfoFrame.less");
</style>
