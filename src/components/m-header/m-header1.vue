<template>
  <div class="wrapper">
    <span class="title-small" @click="jump">温州设计集团大数据可视化分析基础平台</span>
    <div class="title"></div>
    <div class="nav nav1">
      <div class="nav-item" :class="navIsActive(item.to)?'active':''" v-for="(item,index) in list1" :key="index">
        <router-link
          class="nav-link-wrapper"
          tag="div"
          :to="item.to">
          <span class="nav-link">{{item.text}}</span>
        </router-link>
      </div>
    </div>
    <div class="nav nav2">
      <div class="nav-item" :class="navIsActive(item.to)?'active':''" v-for="(item,index) in list2" :key="index">
        <router-link
          class="nav-link-wrapper"
          tag="div"
          :to="item.to">
          <span class="nav-link">{{item.text}}</span>
        </router-link>
      </div>
    </div>
    <div class="right-box">
      <div class="right-content">
        <span class="date" :class="{'show':date!==''}">{{date}}</span>
        <span class="quit" @click="logout"><i></i><span>退出</span></span>
      </div>
    </div>
  </div>
</template>

<script>
import { getDate } from 'common/js/util'

export default {
  name: 'MHeader',
  data() {
    return {
      date: '',
      routerUrl: '',
      list1: [
        { text: '风险态势', to: '/state' },
        { text: '风险一张图', to: '/map' },
        { text: '监测预警', to: '/warning' },
        { text: '分析研判', to: '/analysis' }
      ],
      list2: [
        { text: '指挥调度', to: '/dispatch' },
        { text: '智能预案', to: '/plan' },
        { text: '值班值守', to: '/onduty' },
        { text: '数字孪生', to: '/twins' }
      ]
    }
  },
  mounted() {
    this.date = getDate()
    setInterval(() => {
      this.date = getDate()
    }, 1000)
  },
  methods: {
    logout() {
      window.location.href = 'http://pshyz.f3322.net:9000/logout?service=http://pshyz.f3322.net:9000/'
    },
    jump() {
      window.open('http://' + window.location.host + '/write')
    },
    navIsActive(to) {
      if (this.routerUrl.indexOf(to) === 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    $route(to) {
      this.$nextTick(() => {
        this.routerUrl = to.fullPath
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 60px;
    top: -6px;
    .title {
      width: 599px;
      height: 24px;
      .bg-image('images/title');
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      margin-left: -27px;
      top: 17px;
    }
    .title-small {
      cursor: pointer;
      color: @color-text;
      font-size: @font-size-small;
      float: left;
      width: 170px;
      height: 63px;
      text-align: center;
      line-height: 63px;
    }
    .right-box {
      position: absolute;
      right: 0;
      top: 0;
      height: 43px;
      padding-right: 28px;
      color: @color-text;
      line-height: 42px;
      .right-content {
        margin-top: 26px;
        height: @font-size-small;
      }
      span {
        font-size: @font-size-small;
        line-height: @font-size-small;
        float: left;
      }
      .title {
        padding: 0 20px 0 38px;
        cursor: pointer;
      }
      .quit {
        margin-left: 20px;
        cursor: pointer;
        i {
          width: @font-size-small;
          height: @font-size-small;
          float: left;
          .bg-image('images/quit');
          margin-right: 2px;
        }
        span {
          height: @font-size-small;
          line-height: @font-size-small;
          color: @color-text-hover;
        }
      }
      .date {
        width: 120px;
        visibility: hidden;
        height: @font-size-small;
        &.show {
          visibility: visible;
        }
      }
    }
  }
  .nav {
    position: absolute;
    &.nav1 {
      left: 170px;
    }
    &.nav2 {
      right: 260px;
    }
    .nav-item {
      float: left;
      width: 140px;
      height: 63px;
      background: url("images/nav-default.png") no-repeat center;
      background-size: 118px 30px;
      text-align: center;
      margin-right: -37px;
      &.active {
        background: url("images/nav-hover.png") no-repeat center;
        background-size: 100% 100%;
        .nav-link {
          color: @color-text-hover;
        }
      }
      .nav-link-wrapper {
        display: inline;
      }
      .nav-link {
        font-size: @font-size-medium;
        line-height: 63px;
        color: @color-text;
        cursor: pointer;
      }
    }
  }
</style>
