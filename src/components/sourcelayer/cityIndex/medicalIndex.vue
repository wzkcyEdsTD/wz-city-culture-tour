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
          <div class="number">{{WzMedicalData.outpatientCount}}</div>
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
            <span>2020年7月</span>
          </div>
          <div class="number">{{WzMedicalData.designatedHospitals}}</div>
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
            <span>2020年</span>
          </div>
          <div class="number">{{WzMedicalData.medicalInsuranceInstitution}}</div>
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
            <span>2020年8月</span>
          </div>
          <div class="number">{{WzMedicalData.medicalInsurancePayment}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "medicalIndex",
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
