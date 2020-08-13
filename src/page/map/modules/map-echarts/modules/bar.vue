<template>
  <div class="wrapper" ref="wrapper">
    <div ref="myEchartBox" class="myEchartBox" :id="myUuid">
      <ul class="myEchart" :class="{'full':isFull || city}" ref="ul">
        <li :key="index" v-for="(item,index) in myData">
          <div>
            <span>{{item.key}}</span>
            <div @click="jump(item,index)" :class="{'active':activeIndex===index}">
              <b></b>
              <div>
                <span :style="{'width': myDataMax>0?item.count/myDataMax*100 +'%':0}"></span>
              </div>
            </div>
            <b>{{item.count}}</b>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
import { uuid } from 'common/js/util'

export default {
  name: 'Bar',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    city: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIndex: -1,
      isFull: false,
      scrollTop: 0,
      scrollFlag: null,
      myUuid: 'uuid' + uuid()
    }
  },
  computed: {
    myData() {
      const defaultData = [...this.data]
      if (this.city) {
        const allData = [
          { key: '鹿城区', count: 0 },
          { key: '龙湾区', count: 0 },
          { key: '瓯海区', count: 0 },
          { key: '洞头区', count: 0 },
          { key: '瑞安市', count: 0 },
          { key: '乐清市', count: 0 },
          { key: '龙港市', count: 0 },
          { key: '永嘉县', count: 0 },
          { key: '平阳县', count: 0 },
          { key: '苍南县', count: 0 },
          { key: '文成县', count: 0 },
          { key: '泰顺县', count: 0 },
          { key: '瓯江口', count: 0 },
          { key: '经开区', count: 0 }
        ]
        for (let i = 0; i < allData.length; i++) {
          let flag = true
          for (let j = 0; j < defaultData.length; j++) {
            if (defaultData[j].key === allData[i].key) {
              flag = false
              j = defaultData.length
            }
          }
          if (flag) {
            defaultData.push(allData[i])
          }
        }
      }
      // for (let i = 0; i < defaultData.length - 1; i++) {
      //   for (let j = 0; j < defaultData.length - 1 - i; j++) {
      //     if (defaultData[j].count > defaultData[j + 1].count) {
      //       var temp = defaultData[j]
      //       defaultData[j] = defaultData[j + 1]
      //       defaultData[j + 1] = temp
      //     }
      //   }
      // }
      // defaultData = defaultData.reverse()
      return defaultData
    },
    myDataMax() {
      let max = this.myData[0].count
      for (let i = 1; i < this.myData.length; i++) {
        if (this.myData[i].count > max) {
          max = this.myData[i].count
        }
      }
      return max
    },
    ...mapGetters('map', [
      'collapse2'
    ])
  },
  watch: {
    myData() {
      this.$nextTick(() => {
        this.scrollDestroyHandler()
        if (this.myData.length === 0) {
          this.isFull = false
        } else {
          // this.city 为true是温州市
          // 如果是区县
          if (!this.city) {
            const wrapper = parseInt(window.getComputedStyle(this.$refs.wrapper).height)
            const ul = parseInt(window.getComputedStyle(this.$refs.ul).height)
            if (ul < wrapper) {
              this.isFull = true
            } else {
              this.isFull = false
              this.$nextTick(() => {
                setTimeout(() => {
                  this.scrollTop = 0
                  this.scrollStartHandler()
                }, 100)
              })
            }
          } else {
            this.isFull = true
          }
        }
      })
    },
    collapse2() {
      if (this.collapse2) {
        this.scrollDestroyHandler()
      } else {
        this.scrollStartHandler()
      }
    }
  },
  methods: {
    jump(data, index, bool) {
      if (this.activeIndex !== index) {
        this.activeIndex = index
        this.$emit('change', data)
      } else {
        this.activeIndex = -1
        this.$emit('change', { key: '' })
      }
      if (!bool) {
        let flag = {}
        const flagData = this.$parent.echart.getOption().series[0].data
        for (let i = 0; i < flagData.length; i++) {
          if (flagData[i].selected) {
            flag = flagData[i]
            flag.index = i
          }
        }
        if (flag.name) {
          this.$parent.setEchartSelected(flag.index, flag.name, true)
        }
      }
    },
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = $('#' + this.myUuid)[0]
          this.scrollTop += 1
          dom.scrollTop = this.scrollTop
          if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
            dom.scrollTop = 0
            this.scrollTop = 0
          }
        }, 100)
      }
    },
    scrollDestroyHandler() {
      if (this.scrollFlag) {
        clearInterval(this.scrollFlag)
        this.scrollFlag = null
      }
    }
  },
  mounted() {
    $('#' + this.myUuid).on({
      mouseover: () => {
        this.scrollDestroyHandler()
      },
      mouseout: () => {
        this.scrollStartHandler()
      },
      scroll: () => {
        this.scrollTop = $('#' + this.myUuid)[0].scrollTop
      }
    })
  },
  beforeDestroy() {
    this.scrollDestroyHandler()
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.1rem 0 0.15rem;
    > div {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
  .myEchartBox {
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .myEchart {
    width: 100%;
    > li {
      font-size: 0.16rem;
      position: relative;
      height: 0.26rem;
      > div {
        position: relative;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        display: flex;
        height: 0.14rem;
        > span {
          color: #fff;
          width: 1rem;
          padding-left: 0.2rem;
          height: 0.18rem;
          line-height: 0.18rem;
          position: relative;
          top: -0.02rem;
          display: block;
          .no-wrap();
        }
        > div {
          flex: 1;
          height: 0.14rem;
          position: relative;
          cursor: pointer;
          > b {
            border: 0.02rem solid #4DCEF8;
            border-radius: 0.2rem;
            display: block;
            height: 100%;
          }
          > div {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            border-radius: 0.14rem;
            overflow: hidden;
            > span {
              background: -webkit-gradient(linear, 0% 0%, 100% 100%, from(#1fabfb), to(#05effc));
              border-radius: 0 0.14rem 0.14rem 0;
              display: block;
              height: 100%;
            }
          }
          &.active {
            > b {
              border: 0.02rem solid #ffefb4;
            }
            > div > span {
              background: -webkit-gradient(linear, 0% 0%, 100% 100%, from(#fdff63), to(#ff8650));
            }
          }
        }
        > b {
          color: #fff;
          padding-left: 0.1rem;
          height: 0.14rem;
          line-height: 0.14rem;
          display: block;
          width: 0.6rem;
        }
      }
    }
    &.full {
      height: 100%;
      display: flex;
      flex-direction: column;
      > li {
        flex: 1;
      }
    }
  }
</style>
