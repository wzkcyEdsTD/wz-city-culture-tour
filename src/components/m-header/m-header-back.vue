<template>
  <div class="wrapper">
    <div class="title_first">温州设计集团大数据可视化分析基础平台</div>
    <div class="nav1" :class="{'nofull':ulWidth < boxWidth}">
      <div class="nav-box">
        <ul ref="ul" :style="{'width':ulWidth+'px'}">
          <li
            class="UNcomplete"
            v-for="(item, index) in menuList"
            :key="index"
            @mouseover="mouseover"
            :class="{'router-link-active': $route.path===`/` + (item.url === 'analysis'?'judge':item.url), 'close': item.isPermitted == 0}"
            @click="goRouter(item.url, item.name, item.isPermitted)">
            {{item.name}}
            <div class="undeline">
              <img src="./images/undeline.png" alt/>
            </div>
            <div class="list_line" v-show="index !== menuList.length - 1"></div>
            <div class="modal" v-if="item.name==='分析研判' && item.isPermitted !== 0">
              <div class="item" :class="{'active': judgeType&&judgeType==1}" @click="judge(1)" style="color:#efefef">
                永嘉山洪灾害分析
              </div>
              <div class="item" :class="{'active': judgeType&&judgeType==2}" @click="judge(2)" style="color:#efefef">
                泰顺廊桥防火分析
              </div>
              <div class="item">瑞安安全生产分析</div>
              <div class="item">鹿城楼宇安全分析</div>
              <div class="item">洞头堤岸防台防潮分析</div>
            </div>
          </li>
        </ul>
      </div>
      <img
        v-show="ulWidth>boxWidth"
        :class="{active:prev}"
        @click="move(0-movenum)"
        class="prev"
        src="./images/left.png"
        alt="">
      <img
        v-show="ulWidth>boxWidth"
        :class="{active:next}"
        @click="move( movenum)"
        class="next"
        src="./images/right.png"
        alt="">
    </div>
    <div class="right-content1">
      <div class="title_second">
        <div class="tit_1">{{titleName}}应急管理局</div>
      </div>
    </div>
    <div class="right-content1">
      <div class="quit1" @click="logout">
        <i></i>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import { WWW } from 'api/config'
import { getMenu, getUserInfo } from 'api/public/public'

export default {
  name: "MHeader",
  data() {
    return {
      ulWidth: 999999,
      boxWidth: 999999,
      movenum: 100,
      prev: false,
      next: true,
      date: "",
      type: 0,
      routerUrl: "",
      menuList: []
    };
  },
  created() {
    Promise.all([getUserInfo(), getMenu()]).then(res => {
      let districtName = res[0].districtName
      this.menuList = res[1].map(val => {
        val.district = val.district.split(',')
        return val
      }).filter(val => {
        return val.isHided !== 1
      })
    })
  },
  computed: {
    ...mapGetters(['userInfo']),
    titleName() {
      if (!this.userInfo.districtName) {
        return ''
      } else {
        return this.userInfo.districtName
      }
    },
    judgeType: {
      get() {
        if (this.$route.path === '/judge') {
          if (Number(this.$route.query.type) === 2) return 2
          return 1
        } else {
          return false
        }
      },
      set() {
      }
    }
  },
  methods: {
    mouseover(el) {
      const width = el.currentTarget.offsetLeft +
        el.currentTarget.parentNode.offsetLeft +
        el.currentTarget.parentNode.parentNode.offsetLeft +
        el.currentTarget.parentNode.parentNode.parentNode.offsetLeft
      el.currentTarget.lastElementChild.style.left = width + 'px'
    },
    move(num) {
      const ul = this.$refs.ul
      const el = ul.parentNode
      let value = el.scrollLeft
      el.scrollLeft = value + num
      if (el.scrollLeft > 0) {
        this.prev = true
      } else {
        this.prev = false
      }
      if (el.offsetWidth + el.scrollLeft >= ul.offsetWidth) {
        this.next = false
      } else {
        this.next = true
      }
    },
    logout() {
      window.location.href =
        "http://" + window.location.host + "/logout";
    },
    fire() {
      window.open("http://10.36.234.91:8090/SYGD3D/examples/index2.html");
    },
    judge(type) {
      if (Number(this.$route.query.type) === type) {
        return
      } else {
        if (this.$route.path === '/judge') {
          this.$store.dispatch('changeLoad', true)
        }
        this.$router.push({ path: '/judge', query: { type: type } })
      }
    },
    refrash(path) {
      if (this.$route.path === path) {
        this.$router.go(0)
      } else {
        this.$router.push({ path: path })
      }
    },
    flood() {
      window.open("http://115.223.34.22:8090/fxft2.0/index.html#/login", '_blank');
    },
    tai() {
      window.open("http://10.36.234.86:8080/fxft", '_blank');
    },
    duty() {
      if (WWW === 'http://pshyz.f3322.net:9000' || WWW.indexOf('http://localhost') === 0) {
        window.open("http://pshyz.f3322.net:9002");
      } else {
        window.open("http://10.36.234.84:9002");
      }
    },
    goRouter(router, name, type) {
      if (name === '分析研判' || type == 0) return
      if (router.indexOf('http') > -1) {
        window.open(router)
      } else {
        this.$router.push({ path: `/${router}` })
      }
    },
    jump() {
      if (WWW === 'http://pshyz.f3322.net:9000' || WWW.indexOf('http://localhost') === 0) {
        window.open("http://pshyz.f3322.net:9001")
      } else {
        window.open("http://10.36.234.84:9001")
      }
    },
    navIsActive(to) {
      if (this.routerUrl.indexOf(to) === 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    $route(to, from) {
      this.$nextTick(() => {
        this.routerUrl = to.fullPath;
      });
    },
    menuList() {
      this.$nextTick(() => {
        const childrenEl = this.$refs.ul.children
        let allWidth = 0
        for (let i = 0; i < childrenEl.length; i++) {
          allWidth += childrenEl[i].offsetWidth
        }
        this.ulWidth = allWidth
        this.boxWidth = this.$refs.ul.parentNode.offsetWidth
      })
    }
  }
};
</script>

<style scoped lang="less">
  .wrapper {
    position: absolute;
    z-index: 999;
    width: 100%;
    height: 0.53rem;
    top: -0.06rem;
    background-color: #1c1f24;
    .title_first {
      height: 100%;
      font-size: 0.30rem;
      color: white;
      line-height: 0.6rem;
      text-align: left;
      position: absolute;
      left: 0.22rem;
      cursor: pointer;
    }
    .title_first img {
      vertical-align: middle;
      height: 0.2rem;
      width: 0.35rem;
      margin-right: 0.1rem;
    }
    .title_second {
      width: 0.92rem;
      height: 0.15rem;
      border-left: 0.02rem solid #fff;
      margin-top: 0.24rem;
      // background: #ccc
      left: 2.9rem;
      line-height: 0.13rem;
    }
    .tit_1,
    .tit_2 {
      margin-left: 0.07rem;
      width: 1.4rem;
      font-size: 0.16rem;
      margin-top: 0.03rem;
      -webkit-background-clip: text;
      color: #fff;
    }
    .tit_1 {
      margin-top: 0;
      color: #ffffff;
      letter-spacing: 0.015rem;
    }
    .nav1 {
      position: absolute;
      height: 0.56rem;
      float: left;
      left: 3.5rem;
    }
    li {
      float: left;
      font-size: 0.2rem;
      height: 0.32rem;
      color: #d6d6d6;
      line-height: 0.19rem;
      text-align: center;
      margin-top: 0.21rem;
      cursor: pointer;
      padding-left: 0.5em;
      padding-right: 0.5em;
      position: relative;
      &:first-child {
        padding-left: 0;
      }
    }
    .undeline {
      display: none;
      width: 0.4rem;
      height: 0.03rem;
      margin: 0 auto;
      position: relative;
    }
    .undeline img {
      width: 1rem;
      height: 0.1rem;
      position: absolute;
      left: -0.32rem;
      top: 0.03rem;
    }
    li:hover, li.router-link-active {
      color: #29b5e8;
      font-weight: 600;
      .undeline {
        display: block;
      }
    }
    li.close {
      color: #a3a3a3;
      position: relative;
    }
    li.close:hover {
      color: #a3a3a3;
      font-weight: normal;
      .undeline {
        display: none;
      }
    }
    li.UNcomplete {
      position: relative;
      .modal {
        display: none;
        position: absolute;
        background: #1c1f24;
        text-align: center;
        color: #a3a3a3;
        width: 200%;
        font-size: 0.16rem;
        box-shadow: rgb(86, 170, 255) 0px 0px 30px inset;
        border-radius: 4px;
        left: -0.5rem;
        top: 0.26rem;
        /**/
        width: 200px;
        margin-left: -100px;
        left: 0;
        position: fixed;
        top: 0.45rem;
        .item {
          line-height: 0.3rem;
          height: 0.3rem;
        }
        .item.active {
          color: #29b5e8 !important;
          font-weight: 600;
        }
        .item:hover {
          color: #29b5e8 !important;
          font-weight: 600;
        }
        padding: 0.1rem;
      }
    }
    li.UNcomplete:hover {
      .modal {
        display: block;
      }
      .undeline {
        display: none;
      }
    }
    .right-content1 {
      width: 0.8rem;
      height: 0.72rem;
      right: 1.1rem;
      position: absolute;
    }
    .list_line {
      width: 0.01rem;
      height: 0.16rem;
      .bg-image("images/square");
      top: 0.02rem;
      right: 0rem;
      position: absolute;
    }
    .close:last-child .list_line {
      display: none;
    }
    .quit1 {
      width: 0.65rem;
      height: 0.3rem;
      margin-top: 0.26rem;
      cursor: pointer;
      position: absolute;
      right: -1.35rem;
      i {
        width: @font-size-small;
        height: @font-size-small;
        float: left;
        .bg-image("images/quit");
        margin-right: 0.02rem;
        margin-left: 0.1rem;
      }
      span {
        font-size: 0.10rem;
        float: left;
        line-height: @font-size-small;
        color: @color-text-hover;
        display: block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #00ffff;
        text-align: center;
      }
    }
  }
  .nav1 {
    left: 3.25rem !important;
    right: 2rem;
    overflow: hidden;
    padding: 0 0.36rem;
    position: relative;
    &.nofull {
      padding: 0 0.2rem;
    }
    .nav-box {
      overflow: hidden;
      > ul {
        overflow: hidden;
      }
    }
    > img {
      display: block;
      position: absolute;
      width: 0.32rem;
      height: 0.32rem;
      top: 50%;
      margin-top: 0.02rem;
      transform: translate(0, -50%);
      opacity: 0.2;
      cursor: default;
      &.active {
        opacity: 1;
        cursor: pointer;
      }
      &.prev {
        left: 0;
      }
      &.next {
        right: 0;
      }
    }
  }
  // 屏幕适配1620
  @media screen and (min-width: 5000px) {
    .wrapper .nav1 {
      left: 9.5rem;
    }
  }
</style>
