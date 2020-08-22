<template>
  <div class="header-wrapper">
    <div class="header">
      <div class="info">
        <div class="time-container">
          <div class="time">15:49:52</div>
          <div class="date">2020-8-21</div>
        </div>
        <div class="weather-container">
          <img class="weather-img" src="./images/overcast.png" />
          <div class="temperature">
            <img class="temperature-img" src="./images/temperature.png" />
            <span class="text">29℃</span>
          </div>
        </div>
        <div class="pm-container">
          <div class="pm">Pm2.5</div>
          <div class="number">78</div>
        </div>
      </div>
    </div>
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
  mounted() {
    // this.date = getDate()
    // setInterval(() => {
    //   this.date = getDate()
    // }, 1000)
  },
  methods: {},
  watch: {
    $route(to) {
      this.$nextTick(() => {
        this.routerUrl = to.fullPath;
      });
    },
  },
};
</script>

<style scoped lang="less">
.header-wrapper {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 0.53rem;
  padding: 0 5%;
  background-image: linear-gradient(
    #2580a5 0%,
    rgba(24, 110, 145, 1) 18%,
    rgba(18, 90, 119, 1) 42%,
    rgba(17, 30, 51, 1) 100%
  );
}
.header {
  width: 100%;
  height: 100%;
  .bg-image("./images/header");
  .info {
    position: absolute;
    top: 12%;
    right: 3%;
    display: flex;
    color: #fff;
    .time-container {
      display: flex;
      flex-direction: column;
      text-align: right;
      padding: 0 0.06rem;
      .time {
        font-size: 16px;
      }
      .date {
        font-size: 12px;
        -webkit-transform-origin-x: 0;
        -webkit-transform: scale(0.92);
      }
    }
    .weather-container {
      display: flex;
      align-items: center;
      padding: 0 8px;
      .weather-img {
        height: 0.3rem;
        padding: 0 0.08rem;
      }
      .temperature {
        .temperature-img {
          width: 0.1rem;
        }
        .text {
          font-size: 18px;
        }
      }
    }
    .pm-container {
      display: flex;
      flex-direction: column;
      text-align: right;
      padding: 0 0.1rem;
      .pm {
        font-size: 12px;
      }
      .number {
        font-size: 14px;
      }
    }
  }
}
</style>
