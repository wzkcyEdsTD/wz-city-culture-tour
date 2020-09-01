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
  name: "totalTarget",
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

<style scoped lang="less">
.target-wrapper {
  position: absolute;
  top: 1vh;
  left: 2vw;
  z-index: 200000;

  .header {
    display: block;
    height: 35px;
    line-height: 35px;
    font-family: YouSheBiaoTiHei;
    font-size: 26px;
    letter-spacing: 0px;
    color: #ffffff;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
    position: relative;
    margin-bottom: 3vh;
    padding-left: 15px;
  }

  .header::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 5px;
    width: 150px;
    height: 15px;
    z-index: -1;
    background-image: linear-gradient(90deg, #2acbfe 0%, transparent 100%);
    transform: skewX(-30deg);
  }

  .content {
    .item {
      display: flex;
      align-items: center;
      margin-top: 2vh;
      .icon {
        width: 0.52rem;
      }
      .right {
        display: flex;
        flex-direction: column;
        color: #fff;
        margin-left: 14px;
        .title {
          font-family: PingFang;
          font-size: 15px;
          font-weight: bold;
        }
        .desc {
          margin-top: 6px;
          font-family: PingFang;
          font-size: 12px;
        }
        .number {
          margin-top: 1vh;
          color: #2acbfe;
          font-size: 24px;
          font-family: DIN;
          font-weight: bold;
        }
        .small {
          font-size: 11px;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
