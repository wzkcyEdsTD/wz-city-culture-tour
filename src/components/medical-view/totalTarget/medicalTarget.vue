<template>
  <div class="target-wrapper">
    <span class="header">医疗体征</span>
    <ul class="content">
      <li class="item">
        <img class="icon hospital" src="../../../common/images/hospital.png" />
        <div class="right">
          <div class="title">
            实时门诊人次
            <span class="small">(人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当日</span>
          </div>
          <div class="number">{{WzAllData.outpatientCount}}</div>
        </div>
      </li>
      <li class="item">
        <img class="icon ambulance" src="../../../common/images/ambulance.png" />
        <div class="right">
          <div class="title">
            定点医院数
            <span class="small">(家)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>2020年7月</span>
          </div>
          <div class="number">{{WzAllData.designatedHospitals}}</div>
        </div>
      </li>
      <li class="item">
        <img class="icon doctor" src="../../../common/images/doctor.png" />
        <div class="right">
          <div class="title">
            医保参保单位
            <span class="small">(家)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>2020年</span>
          </div>
          <div class="number">{{WzAllData.medicalInsuranceInstitution}}</div>
        </div>
      </li>
      <li class="item">
        <img class="icon nurce" src="../../../common/images/nurse.png" />
        <div class="right">
          <div class="title">
            医保支付额
            <span class="small">(万元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>2020年8月</span>
          </div>
          <div class="number">{{WzAllData.medicalInsurancePayment}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "medicalTarget",
  computed: {
    ...mapGetters("map", ["WzAllData"]),
  },
  async mounted() {
    await this.fetchWzAllData();
  },
  methods: {
    ...mapActions("map", ["SetWzAllData"]),
    /**
     * 概览数据
     */
    async fetchWzAllData() {
      await this.SetWzAllData();
    },
  },
};
</script>
