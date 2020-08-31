<template>
  <div class="target-wrapper">
    <span class="header">医疗体征</span>
    <ul class="content">
      <li class="item">
        <i class="icon hospital"></i>
        <div class="right">
          <div class="title">
            医疗机构数
            <span class="small">(家)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>2020年</span>
          </div>
          <div class="number">{{WzAllData.medicalInstitution}}</div>
        </div>
      </li>
      <li class="item">
        <i class="icon ambulance"></i>
        <div class="right">
          <div class="title">
            定点医院数
            <span class="small">(家)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>2020年</span>
          </div>
          <div class="number">{{WzAllData.designatedHospitals}}</div>
        </div>
      </li>
      <li class="item">
        <i class="icon doctor"></i>
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
        <i class="icon nurse"></i>
        <div class="right">
          <div class="title">
            医保支付额
            <span class="small">(万元)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>2020年</span>
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
  top: 1.06rem;
  left: 50px;
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
    margin-bottom: 10px;
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
    background-image: linear-gradient(90deg, #0addca 0%, transparent 100%);
    transform: skewX(-30deg);
  }

  .content {
    .item {
      display: flex;
      align-items: center;
      margin-top: 18px;
      .icon {
        width: 0.52rem;
        height: 0.52rem;
        &.hospital {
          .bg-image("../../../common/images/hospital");
        }
        &.ambulance {
          .bg-image("../../../common/images/ambulance");
        }
        &.doctor {
          .bg-image("../../../common/images/doctor");
        }
        &.nurse {
          .bg-image("../../../common/images/nurse");
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        color: #fff;
        margin-left: 10px;
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
          margin-top: 6px;
          color: #00ffeb;
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
