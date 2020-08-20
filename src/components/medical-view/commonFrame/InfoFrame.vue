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
        <section>
          <span class="section-title">今日病情指标</span>
        </section>
        <section>
          <span class="section-title">今日就诊指标</span>
        </section>
        <section>
          <span class="section-title">今日医保指标</span>
        </section>
        <section>
          <span class="section-title">医院简介</span>
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
    return {};
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
