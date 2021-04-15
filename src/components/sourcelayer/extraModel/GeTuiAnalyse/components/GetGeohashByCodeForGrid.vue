<template>
  <div class="get-geohash-by-code">
    <span class="header">区域选择</span>
    <div class="form-content">
      <el-select
        :style="{ width: '10vh' }"
        v-model="areaCode"
        size="small"
        placeholder="请选择区县"
        @change="updateAreaHandler"
      >
        <el-option
          v-for="item in areaCodeListFixed"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        :style="{ width: '12vh' }"
        :disabled="streetCodeListFixed.length == 1"
        v-model="streetCode"
        size="small"
        placeholder="请选择街道"
      >
        <el-option
          v-for="item in streetCodeListFixed"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button size="small" :loading="isLoading" @click="doWithAreaStreetCode"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "getGeohashByCode",
  data() {
    return {
      areaCode: "330302",
      streetCode: "330302030000",
      // streetCode: undefined,
    };
  },
  props: ["BUS_EVENT_TAG", "isLoading"],
  computed: {
    ...mapGetters("option", ["areaCodeList"]),
    areaCodeListFixed() {
      return this.areaCodeList;
    },
    streetCodeListFixed() {
      const forceItem = this.areaCodeListFixed.filter(
        (v) => v.value == this.areaCode
      )[0] || { children: [] };
      return [{ label: "全部", value: undefined }].concat(forceItem.children);
    },
  },
  created() {
    !this.areaCodeList.length && this.SetAreaCodeList();
  },
  methods: {
    ...mapActions("option", ["SetAreaCodeList"]),
    updateAreaHandler() {
      this.streetCode = undefined;
    },
    doWithAreaStreetCode() {
      const code = this.streetCode || this.areaCode;
      this.$bus.$emit(this.BUS_EVENT_TAG, code);
    },
  },
};
</script>

<style lang="less" scoped>
.get-geohash-by-code {
  .header {
    display: block;
    height: 4vh;
    line-height: 4vh;
    font-family: YouSheBiaoTiHei;
    font-size: 3.2vh;
    color: #ffffff;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
    position: relative;
    padding-left: 1.6vh;
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0.6vh;
      width: 14vh;
      height: 1.6vh;
      z-index: -1;
      background-image: linear-gradient(90deg, #2acbfe 0%, transparent 100%);
      transform: skewX(-30deg);
    }
  }
  .form-content {
    margin-top: 1vh;
    &/deep/ .el-input {
      .el-input__inner {
        background: transparent;
        color: white;
      }
    }
    &/deep/ .el-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
}
</style>
