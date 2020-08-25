<template>
  <div class="wrapper">
    <span class="header">医疗体征</span>
    <ul class="content">
      <li class="item">
        <i class="icon hospital"></i>
        <div class="right">
          <div class="title">甲级医院数<span class="small">(座)</span></div>
          <div class="desc">温州全市 /<span class="small">2020年</span></div>
          <div class="number">88,888</div>
        </div>
      </li>
      <li class="item">
        <i class="icon ambulance"></i>
        <div class="right">
          <div class="title">救护车数<span class="small">(辆)</span></div>
          <div class="desc">温州全市 /<span class="small">2020年</span></div>
          <div class="number">88,888</div>
        </div>
      </li>
      <li class="item">
        <i class="icon doctor"></i>
        <div class="right">
          <div class="title">主任医生数<span class="small">(人)</span></div>
          <div class="desc">温州全市 /<span class="small">2020年</span></div>
          <div class="number">88,888</div>
        </div>
      </li>
      <li class="item">
        <i class="icon nurse"></i>
        <div class="right">
          <div class="title">主任护师数<span class="small">(人)</span></div>
          <div class="desc">温州全市 /<span class="small">2020年</span></div>
          <div class="number">88,888</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// import { getDate } from 'common/js/util'

export default {
  name: "MHeader",
  data() {
    return {
      date: "",
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.wrapper {
  position: absolute;
  top: 20px;
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
        width: 0.4rem;
        height: 0.4rem;
        &.hospital {
          .bg-image('../../../common/images/hospital');
        }
        &.ambulance {
          .bg-image('../../../common/images/ambulance');
        }
        &.doctor {
          .bg-image('../../../common/images/doctor');
        }
        &.nurse {
          .bg-image('../../../common/images/nurse');
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        color: #fff;
        margin-left: 10px;
        .title {
          font-family: PingFang;
          font-size: 14px;
          font-weight: bold;
        }
        .desc {
          margin-top: 8px;
          font-family: PingFang;
          font-size: 14px;
        }
        .number {
          margin-top: 8px;
          color: #00ffeb ;
          font-size: 18px;
          font-family: DIN;
          font-weight: bold;
        }
        .small {                        
          font-size: 12px;
          -webkit-transform-origin-x: 0;
          -webkit-transform: scale(0.83);
        }
      }
    }
  }
}
</style>
