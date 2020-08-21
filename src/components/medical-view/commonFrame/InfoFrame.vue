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
          <span class="title">第六人民医院</span>
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
                      <span class="item-num">{{ _item.num }}</span>
                      <span class="item-unit">{{ _item.unit }}</span>
                    </td>
                    <td
                      :style="{ color: _item.ratio >= 0 ? '#04b72d' : '#fc5453' }"
                    >{{ _item.ratio }}{{ _item.unit }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section>
          <span class="section-title">医院简介</span>
          <div>
            <span class="address">地址：地址地址地址地址地址地址地址地址地址地址地址地址</span>
            <span
              class="summary"
            >乐清东敏中西医结合医院是经市卫生局审批的一家以中西医结合为特色的医院。设有急珍科.内科.外科.儿科.妇产科.骨伤科..推拿理疗科.（椎间盘突出科）.中医内科，中西医结合科。配有500毫</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "InfoFrame",
  data() {
    return {
      indexEnums: [
        {
          label: "今日病情指标",
          data: [
            { label: "发热病人数", num: 421, ratio: -32, unit: "人" },
            { label: "肿瘤病人数", num: 3283, ratio: -12, unit: "人" },
            { label: "传染病人数", num: 52316, ratio: -222, unit: "人" },
            { label: "120接警数", num: 2336, ratio: -232, unit: "次" },
          ],
        },
        {
          label: "今日就诊指标",
          data: [
            { label: "门诊费用", num: 4921, ratio: -32, unit: "万元" },
            { label: "住院费用", num: 1280, ratio: -12, unit: "万元" },
            { label: "120接警数", num: 2336, ratio: -232, unit: "次" },
            { label: "住院人数", num: 3283, ratio: 42, unit: "万元" },
          ],
        },
        {
          label: "今日医保指标",
          data: [
            { label: "医保就医人数", num: 421, ratio: -32, unit: "人" },
            { label: "医保支付额", num: 200, ratio: -12, unit: "万元" },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapGetters("map", ["isInfoFrame"]),
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
