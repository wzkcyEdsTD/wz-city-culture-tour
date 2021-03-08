<template>
  <div class="event-form">
    <div>
      <i>时间范围</i>
      <el-select
        disabled
        v-model="timeType"
        placeholder="事件时间范围"
        size="small"
        @change="selectChangeHandler"
      >
        <el-option
          v-for="item in EVENT_TIME"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div>
      <i>区域</i>
      <el-select
        disabled
        v-model="areaCode"
        placeholder="区域"
        size="small"
        @change="selectChangeHandler"
      >
        <el-option
          v-for="item in AREA_CODE"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div>
      <i>处理状态</i>
      <el-select
        disabled
        v-model="dealStatus"
        placeholder="事件状态"
        size="small"
        @change="selectChangeHandler"
      >
        <el-option
          v-for="item in DEAL_STATUS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { EVENT_TIME, AREA_CODE, DEAL_STATUS } from "config/local/eventFormConfig";
export default {
  name: "EventForm",
  data() {
    return {
      EVENT_TIME,
      timeType: 6,
      AREA_CODE,
      areaCode: 330300,
      DEAL_STATUS,
      dealStatus: 0,
    };
  },
  computed: {
    ...mapGetters("map", ["eventFormParams"]),
  },
  created() {
    const { timeType, areaCode, dealStatus } = this.eventFormParams;
    this.timeType = timeType;
    this.areaCode = areaCode;
    this.dealStatus = dealStatus;
  },
  methods: {
    ...mapActions("map", ["SetEventFormParams"]),
    selectChangeHandler() {
      this.SetEventFormParams({
        timeType: this.timeType,
        areaCode: this.areaCode,
        dealStatus: this.dealStatus,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.event-form {
  padding-top: 1.1vh;
  text-align: center;
  > div {
    margin-left: 2vh;
    display: inline-block;
    vertical-align: middle;
    > i {
      font-style: normal;
      color: white;
      font-size: 1.6vh;
      margin-right: 0.6vh;
    }
    &/deep/ .el-input {
      width: 13vh;
      .el-input__inner {
        background: transparent;
        color: white;
      }
    }
  }
}
</style>
