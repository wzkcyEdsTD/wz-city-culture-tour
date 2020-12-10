<template>
  <div class="target-wrapper">
    <span class="header">医疗体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/medical/hospital.png" />
        <div>
          <div class="title">
            实时门诊人次
            <span class="small">(人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当日</span>
          </div>
          <div class="number">
            <DynamicNum
              v-if="WzMedicalData.全市"
              :value="WzMedicalData.全市.门诊人次"
              decimals="0"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/medical/ambulance.png" />
        <div>
          <div class="title">
            定点医院数
            <span class="small">(家)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum
              v-if="WzMedicalData.市本级"
              :value="WzMedicalData.市本级.定点医院家数"
              decimals="0"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/medical/doctor.png" />
        <div>
          <div class="title">
            医保参保单位
            <span class="small">(家)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum
              v-if="WzMedicalData.全市"
              :value="WzMedicalData.全市.医保参保单位数"
              decimals="0"
            />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/medical/nurse.png" />
        <div>
          <div class="title">
            医保支付额
            <span class="small">(万元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当月</span>
          </div>
          <div class="number">
            <DynamicNum
              v-if="WzMedicalData.市本级"
              :value="(WzMedicalData.市本级.医保支付额 / 10000).toFixed(2)"
            />
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
  name: "medicalIndex",
  components: { DynamicNum },
  computed: {
    ...mapGetters("map", ["WzMedicalData"]),
  },
  async created() {
    await this.fetchWzMedicalData();
  },
  methods: {
    ...mapActions("map", ["SetWzMedicalData"]),
    /**
     * 概览数据
     */
    async fetchWzMedicalData() {
      await this.SetWzMedicalData();
    },
  },
};
</script>
