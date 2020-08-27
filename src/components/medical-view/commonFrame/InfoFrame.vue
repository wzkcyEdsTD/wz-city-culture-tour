<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-08-12 20:35:31
 * @LastEditors: eds
 * @Description:
 * @FilePath: \旅游\src\components\map-view\commonFrame\InfoFrame.vue
-->
<template>
  <div class="bimframe">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
      <div>
        <header>
          <span class="title">{{ name }}</span>
        </header>
        <section v-for="(item, index) in indexEnums" :key="index">
          <span class="section-title">{{ item.label }}</span>
          <div class="block-outside">
            <div class="block" v-for="(_item, _index) in item.data">
              <table>
                <tbody>
                  <tr>
                    <td>{{ _item.label }}</td>
                    <td>同比昨日</td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        class="item-num"
                      >{{ numObj.hasOwnProperty(_item.num) ? numObj[_item.num] :_item.num }}</span>
                      <span class="item-unit">{{ _item.unit }}</span>
                    </td>
                    <td :style="{ color: _item.ratio >= 0 ? '#04b72d' : '#fc5453' }">
                      <span>{{ _item.ratio >= 0 ? `+${_item.ratio}` : _item.ratio }}{{ _item.unit }}</span>
                      <i :class="[ _item.ratio >= 0 ? 'ratio-up' : 'ratio-down' ]"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="desc-wrapper">
          <span class="section-title">医院简介</span>
          <div>
            <span class="address">地址：{{ address || `暂无地址` }}</span>
            <span class="summary">{{ summary || `暂无简介` }}</span>
          </div>
          <div class="imgs">
            <ul>
              <li v-for="(item, index) in imgHash[name]" :key="index">
                <img :src="`/static/images/医院/${item}`" />
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
    <div class="mask-right"></div>
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
      indexEnums: [
        {
          label: "今日病情指标",
          data: [
            { label: "发热病人数", num: "feverNum", ratio: -22, unit: "人" },
            { label: "肿瘤病人数", num: 888, ratio: -22, unit: "人" },
            { label: "传染病人数", num: 888, ratio: -22, unit: "人" },
            { label: "120接警数", num: 888, ratio: -22, unit: "次" },
          ],
        },
        {
          label: "今日就诊指标",
          data: [
            { label: "门诊费用", num: 888, ratio: -22, unit: "万元" },
            { label: "住院费用", num: 888, ratio: -22, unit: "万元" },
            { label: "住院床位数", num: 888, ratio: -22, unit: "床" },
            { label: "住院人数", num: 888, ratio: 22, unit: "人" },
          ],
        },
        {
          label: "今日医保指标",
          data: [
            { label: "医保就医人数", num: 888, ratio: -22, unit: "人" },
            { label: "医保支付额", num: 888, ratio: -22, unit: "万元" },
          ],
        },
      ],
      indexOption: {
        attributes: {
          SHORTNAME: "平阳县人民医院",
        },
      },
    };
  },
  computed: {
    ...mapGetters("map", ["isInfoFrame"]),
    name() {
      if (this.indexOption && this.indexOption.attributes)
        return this.indexOption.attributes.SHORTNAME;
      else return "";
    },
    address() {
      if (this.indexOption && this.indexOption.attributes)
        return this.indexOption.attributes.ADDRESS;
      else return "";
    },
    summary() {
      if (this.indexOption && this.indexOption.attributes)
        return this.indexOption.attributes.SUMMARY;
      else return "";
    },
    numObj() {
      if (this.indexOption && this.indexOption.feverNum)
        return {
          feverNum: this.indexOption.feverNum,
        };
      else
        return {
          feverNum: 0,
        };
    },
  },
  beforeDestroy() {
    this.closeBimFrame();
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
