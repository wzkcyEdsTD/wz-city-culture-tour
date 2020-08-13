<template>
  <transition name="slide">
    <div class="map-enterprise flex flex-y" v-show="isShow">
      <h3 class="title">{{title}}</h3>
      <i class="close" @click="close" v-show="!isShowBigImg"></i>
      <ul class="header-box">
        <li
          :key="index"
          v-for="(item,index) in formData"
          :class="activeIndex === index ? 'active' : ''"
          @click.prevent="custormAnchor('card'+index,index)">{{item.typeName}}
        </li>
      </ul>
      <div class="content-box flex-1">
        <div ref="cardBox">
          <!--基本信息-->
          <ItemTitle id="card0" :title="getBaseList.typeName" color="orange"></ItemTitle>
          <div class="table-box">
            <div class="onInformation" v-if="!getBaseList.columnInfos || getBaseList.columnInfos.length===0">暂无信息</div>
            <div
              class="item"
              :key="'a'+index"
              v-if="item.attname!=='pic_url'"
              v-for="(item,index) in getBaseList.columnInfos">
              <span class="key" :title="item.description">{{item.description}}</span>
              <b class="value" :title="item.value">{{item.value}}</b>
            </div>
            <div class="item" v-if="getBaseList.columnInfos.length%2===1">
              <span class="key"></span>
              <b class="value"></b>
            </div>
          </div>
          <div class="base-img" v-if="getBaseImg.value">
            <img @click="showBigImg" :src="'/file/picture/'+getBaseImg.value" alt="">
            <div class="big-img-wrapper" v-show="isShowBigImg">
              <i @click="hideBigImg"></i>
              <img :src="'/file/picture/'+getBaseImg.value" alt="">
            </div>
          </div>
          <!--别的信息-->
          <template v-for="(item1,index1) in getList">
            <ItemTitle :key="'b'+index1" :id="'card'+(index1+1)" :title="item1.typeName" color="orange"></ItemTitle>
            <template v-if="item1.typeName==='分级管控'">
              <table :key="'aa'+index1" class="table" :style="{'width':percentWidth(item1)}">
                <thead>
                <tr>
                  <th :key="'th'+index4" v-for="(item4,index4) in item1.columnInfos[0]">
                    {{item4.description}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr :key="'aa-tr'+index2" v-for="(item2,index2) in item1.columnInfos" v-show="item1.columnInfos.length">
                  <td :key="'aa-td'+index3" v-for="(item3,index3) in item2">
                    <span @click="openPDF(item3)" class="pointer" v-if="item3.attname==='url'">{{item3.value}}</span>
                    <span v-else>{{item3.value}}</span>
                  </td>
                </tr>
                </tbody>
              </table>
            </template>
            <template v-else-if="item1.typeName==='物联感知设备'">
              <div :key="'bb'+index1">
                <div class="table-box" style="margin-bottom: 0;" :class="item1.columnInfos.info.length?'':'no-line'">
                  <div
                    class="item"
                    :key="'bbbb'+index3"
                    v-for="(item3,index3) in item1.columnInfos.info">
                    <span class="key" :title="item3.description">{{item3.description}}</span>
                    <b class="value" :title="item3.value">{{item3.value}}</b>
                  </div>
                  <div class="item" v-if="item1.columnInfos.info.length%2===1">
                    <span class="key"></span>
                    <b class="value"></b>
                  </div>
                </div>
                <ul class="table video-list">
                  <li :key="'bbb'+index2" v-for="(item2,index2) in item1.columnInfos.video">
                    <div ref="videoWidth">
                      <div>
                        <button class="full-video" @click="fullVideo(item2.video_url)">全屏</button>
                        <iframe :src="item2.video_url"></iframe>
                      </div>
                    </div>
                  </li>
                </ul>
                <BigVideo ref="fullVideoEl"></BigVideo>
              </div>
            </template>
            <template v-else>
              <table :key="'zz'+index1" class="table" :style="{'width':percentWidth(item1)}">
                <thead>
                <tr>
                  <th :key="'zz-th'+index4" v-for="(item4,index4) in item1.columnInfos[0]">
                    {{item4.description}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr :key="'zz-tr'+index2" v-for="(item2,index2) in item1.columnInfos" v-show="item1.columnInfos.length">
                  <td :key="'zz-td'+index3" v-for="(item3,index3) in item2">{{item3.value}}</td>
                </tr>
                </tbody>
              </table>
            </template>
          </template>
        </div>
      </div>
      <PDF ref="pdf" :url="pdfUrl" @init="initPdfUrl"></PDF>
    </div>
  </transition>
</template>
<script>
import ItemTitle from 'components/item-title/item-title'
import { getTableData } from 'api/map/map'
import PDF from './modules/pdf'
import BigVideo from 'components/big-video/big-video'

export default {
  name: 'MapEnterprise',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    title() {
      let str = ''
      if (this.formData[0]) {
        for (let i = 0; i < this.formData[0].columnInfos.length; i++) {
          var item = this.formData[0].columnInfos[i]
          if (item.attname === 'name') {
            str = item.value
            i = this.formData[0].columnInfos.length
          }
        }
      }
      if (!str) {
        str = '信息详情'
      }
      return str
    },
    getList() {
      return this.formData.filter((item, index) => index > 0)
    },
    getBaseList() {
      const obj = JSON.parse(JSON.stringify(this.formData[0])) || {}
      for (let i = 0; i < obj.columnInfos.length; i++) {
        if (obj.columnInfos[i].attname === 'pic_url') {
          obj.columnInfos.splice(i, 1)
          i = obj.columnInfos.length
        }
      }
      return obj
    },
    getBaseImg() {
      let res = {
        attname: '',
        description: '',
        value: ''
      }
      const obj = JSON.parse(JSON.stringify(this.formData[0])) || {}
      for (let i = 0; i < obj.columnInfos.length; i++) {
        if (obj.columnInfos[i].attname === 'pic_url') {
          res = obj.columnInfos[i]
        }
      }
      return res
    }
  },
  watch: {
    data() {
      this.close()
      this.initData()
    }
  },
  data() {
    return {
      formData: [{ columnInfos: [] }], // 要显示的数据
      activeName: 'card0',
      isShow: false,
      activeIndex: 0,
      pdfUrl: '',
      isShowBigImg: false,
      videoStyle: {}
    }
  },
  methods: {
    fullVideo(url) {
      this.$refs.fullVideoEl[0].show(url)
    },
    initPdfUrl() {
      this.pdfUrl = ''
    },
    showBigImg() {
      this.isShowBigImg = true
    },
    hideBigImg() {
      this.isShowBigImg = false
    },
    openPDF(item) {
      // this.pdfUrl = '/file/pdf/中国石化销售股份有限公司浙江文成南田加油站_应急预案.pdf'
      this.pdfUrl = '/file/pdf/' + item.value
      this.$refs.pdf.show()
    },
    percentWidth(item) {
      let res = ''
      if (item.columnInfos[0]) {
        let width = item.columnInfos[0].length / 3 * 100
        width = width > 100 ? 100 : width
        res = width + '%'
      }
      return res
    },
    initData() {
      const me = this
      this.activeName = 'card0'
      this.activeIndex = 0
      getTableData(this.data.smid, this.data.table_name).then(data => {
        const resData = []
        data.forEach((item) => {
          if (item.columnInfos instanceof Array) {
            if (item.columnInfos.length > 0) {
              resData.push(item)
            }
          } else {
            if (item.columnInfos.video && item.columnInfos.video.length > 0) {
              resData.push(item)
            } else if (item.columnInfos.info && item.columnInfos.info.length > 0) {
              let num = 0
              for (let i = 0; i < item.columnInfos.info.length; i++) {
                if (item.columnInfos.info[i].value !== null) {
                  num += 1
                  i = item.columnInfos.info.length
                }
              }
              if (num > 0) {
                resData.push(item)
              }
            }
          }
        })
        this.formData = resData
        if (!me.data.latitude) {
          me.show()
        }
      })
    },
    custormAnchor(anchorName, index) {
      const anchorElement = document.getElementById(anchorName)
      if (anchorElement) {
        const total = anchorElement.offsetTop
        this.$refs.cardBox.scrollTop = total
        this.activeIndex = index
      }
    },
    close() {
      this.isShow = false
    },
    show(spec) {
      if (!this.isShow) {
        this.isShow = true
        if (!spec) {
          this.activeIndex = 0
          setTimeout(() => {
            this.$refs.cardBox.scrollTop = 0
          }, 20)
        } else {
          this.activeIndex = this.formData.length - 1
          setTimeout(() => {
            this.$refs.cardBox.scrollTop = 999999
          }, 20)
        }
      }
    }
  },
  components: {
    ItemTitle,
    PDF,
    BigVideo
  }
}
</script>

<style scoped lang="less">
  .map-enterprise {
    opacity: 1;
    width: 7rem;
    position: absolute;
    right: 0.14rem;
    bottom: 0.05rem;
    top: 80px;
    z-index: 999999;
    padding : 10px;
    /*background: rgba(3, 67, 106, 0.95);*/
    background: #01334e;
    padding: 0.1rem;
    .title {
      height: 0.35rem;
      line-height: 0.35rem;
      color: #fff;
      font-size: 0.2rem;
      padding: 0 0.4rem 0 0.1rem;
      .no-wrap();
    }
    .header-box {
      margin-bottom: 0.1rem;
      margin-top: 0.1rem;
      line-height: 0.3rem;
      overflow: hidden;
      li {
        float: left;
        line-height: 0.2rem;
        text-align: center;
        color: #E3DE0B;
        cursor: pointer;
        position: relative;
        padding: 0 0.1rem;
        font-size: 0.16rem;
        margin-bottom: 0.1rem;
        &.active:before {
          content: '';
          position: absolute;
          bottom: -0.05rem;
          left: 50%;
          width: 60%;
          height: 0.02rem;
          background: #43BAFE;
          transform: translate(-50%, 0);
        }
      }
    }
    .content-box {
      position: relative;
      > div {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow: auto;
      }
    }
    .table-box {
      margin-bottom: 0.3rem;
      border-top: 0.01rem solid #0D5978;
      border-left: 0.01rem solid #0D5978;
      overflow: hidden;
      &.no-line {
        border-top: none;
      }
      .item {
        position: relative;
        float: left;
        width: 50%;
        .key {
          color: #ebe8c6;
          /*background: rgba(62,134,174,0.3);*/
          background: #184660;
          width: 1.2rem;
          height: 0.32rem;
          line-height: 0.32rem;
          text-align: center;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          border-right: 0.01rem solid #024364;
          border-bottom: 0.01rem solid #2c5a73;
          font-size: 0.16rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 0.05rem;
        }
        .value {
          color: #fff;
          width: 100%;
          height: 0.32rem;
          line-height: 0.32rem;
          border-right: 0.01rem solid #024364;
          border-bottom: 0.01rem solid #024364;
          padding: 0 0.1rem 0 1.3rem;
          display: block;
          font-size: 0.16rem;
          font-weight: 400;
          .no-wrap();
        }
      }
    }
    .table {
      margin-bottom: 0.3rem;
      max-width: 100%;
      font-size: 0.12rem;
      border-collapse: collapse;
      text-align: center;
      thead {
        tr {
          th {
            color: #ebe8c6;
            font-weight: 400;
            border: 0.01rem solid rgba(42, 127, 161, 0.4);
            padding: 0.02rem 0.1rem;
            line-height: 0.3rem;
            vertical-align: middle;
            font-size: 0.16rem;
            background: rgba(62, 134, 174, 0.3);
          }
        }
      }
      tbody {
        tr {
          td {
            color: #fff;
            border: 0.01rem solid rgba(42, 127, 161, 0.4);
            padding: 0.02rem 0.1rem;
            line-height: 0.3rem;
            vertical-align: middle;
            font-size: 0.16rem;
            .pointer {
              cursor: pointer;
            }
          }
        }
      }
    }
    .close {
      position: absolute;
      right: 0.2rem;
      top: 0.17rem;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('../../images/zoom-in');
      transform: rotate(-45deg);
      transition: all 0.1s linear;
      cursor: pointer;
      &:hover {
        transform: rotate(45deg);
      }
    }
  }
  .base-img {
    width: 60%;
    height: auto;
    margin: -0.2rem auto 0.3rem;
    > img {
      max-width: 100%;
      display: block;
      margin: 0 auto;
      cursor: pointer;
    }
  }
  .big-img-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.4);
    > i {
      width: 0.3rem;
      height: 0.3rem;
      display: block;
      .bg-image('./modules/images/close');
      background-size: 0.2rem 0.2rem;
      position: absolute;
      right: 0.34rem;
      top: 0.71rem;
      transform: rotate(-45deg);
      transition: all 0.1s linear;
      cursor: pointer;
      border-radius: 50%;
      border: 0.02rem solid #fff;
      z-index: 1;
      &:hover {
        transform: rotate(45deg);
      }
    }
    > img {
      width: auto;
      height: 90%;
      margin: 0 auto;
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .onInformation {
    color: #fff;
  }
  .video-list {
    overflow: hidden;
    > li {
      float: left;
      width: 50%;
      padding: 0.05rem;
      > div {
        width: 100%;
        height: 2.52rem;
        > div {
          width: 3.9rem;
          height: 3rem;
          position: relative;
          margin: 0 auto;
          transform: scale(0.84);
          transform-origin: 0 0;
          > iframe {
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: #000;
          }
        }
      }
    }
  }
  .full-video {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: pointer;
  }
</style>
