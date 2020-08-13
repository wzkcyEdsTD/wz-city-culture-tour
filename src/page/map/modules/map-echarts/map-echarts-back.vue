<template>
  <div class="wrapper-echarts flex flex-y">
    <div class="tags flex">
      <el-tag
        class="flex-1 tab"
        :class="index===tabIndex?'active':''"
        type="success"
        :key="index"
        v-for="(item,index) in tabArr"
        @click="tabClick(index)"
      >{{item}}
      </el-tag>
    </div>
    <div class="flex-1 relative">
      <div class="main-box">
        <div class="echarts" :class="tabIndex===0?'active':''">
          <Bar ref="bar" :city="barCity" :data="barData" @change="barChange"></Bar>
        </div>
        <div class="echarts" :class="tabIndex===1?'active':''">
          <div
            class="echart-bing wrapper-two"
            ref="echart"
            :class="listOrChartIndex===0&&tabIndex===1?'active':''"></div>
          <div class="list wrapper-two" :class="listOrChartIndex===1&&tabIndex===1?'active':''">
            <div class="list-wrapper">
              <div class="box table-box">
                <el-table
                  height="100%"
                  ref="singleTable"
                  class="table-content"
                  highlight-current-row
                  @row-click="tableRowClick"
                  :data="scaleData">
                  <el-table-column
                    align="center"
                    prop="name"
                    label="名称"
                    header-align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="value"
                    label="个数"
                    header-align="center"
                  >
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <el-select
            class="global-search"
            v-model="selectValue"
            placeholder="请选择"
            :popper-append-to-body="appendBody"
            @change="selectChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="typeIndex flex">
            <div class="item flex-1" @click="changeTypeIndex">
              <img v-if="listOrChartIndex===0" src="./images/chart_on.png" alt="">
              <img v-else src="./images/chart_non.png" alt="">
            </div>
            <div class="item flex-1" @click="changeTypeIndex">
              <img v-if="listOrChartIndex===1" src="./images/list_on.png" alt="">
              <img v-else src="./images/list_non.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { statistics } from 'api/map/map'
import { getRem } from 'common/js/util'
import Bar from './modules/bar'

export default {
  name: 'MapEcharts',
  data() {
    return {
      appendBody: false,
      tabArr: ['区域统计', '类别统计'], // tab标签个数
      tabIndex: 0, // tab标签的下标
      echart: null, // 图表
      selectValue: '',
      options: [],
      barCity: false, // 柱状判断是区县还是市级
      barData: [], // 柱状图数据
      listOrChartIndex: 0, // 类别统计的下标
      scaleData: [] // 列表数据
    }
  },
  computed: {
    ...mapGetters('map', [
      'currentOnePoint',
      'treeCheckedList',
      'typeIndex'
    ]),
    ...mapGetters([
      'userInfo',
      'resize'
    ])
  },
  methods: {
    changeTypeIndex() {
      this.listOrChartIndex = (this.listOrChartIndex + 1) % 2
    },
    initData() {
      const dData = this.currentOnePoint
      if (dData && dData.datasetname) {
        const tableName = dData.datasetname.split(':')[1]
        const chartField = dData.chartField
        statistics([chartField, ...dData.chartValue], tableName, this.userInfo.district, dData.sql).then((data) => {
          if (!data || !data.length) {
            return false
          }
          // 传值给柱状图
          this.barData = data[0]
          this.barCity = !(this.userInfo.district.length > 4)
          // 以下是另外一个echart
          const optionArr = []
          dData.chartValue.forEach((item, index) => {
            optionArr.push({
              label: dData.chartName[index],
              value: item,
              data: data[index + 1]
            })
          })
          this.options = optionArr
          this.selectValue = dData.chartValue[0]
          this.initEchart2()
        })
      } else {
        this.barData = []
        this.options = [{ value: '', data: [] }]
        this.selectValue = ''
        this.initEchart2()
      }
    },
    // 初始化饼图
    initEchart2() {
      this.$nextTick(() => {
        let index = -1
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].value === this.selectValue) {
            index = i
          }
        }
        if (index !== -1) {
          const data = this.options[index].data
          var scaleData = []
          var scaleData2 = []
          data.forEach((item) => {
            scaleData.push({
              name: item.key,
              value: item.count
            })
            scaleData2.push({
              name: item.key,
              value: item.count,
              itemStyle: {
                color: 'rgba(250,250,250,0.3)'
              }
            })
          })
          this.scaleData = scaleData
          this.echart = null
          const myChart = this.$echarts.init(this.$refs.echart)
          let radiusAee = []
          if (scaleData.length <= 8) {
            radiusAee = ['20%', '55%']
          } else {
            radiusAee = ['15%', '50%']
          }
          myChart.setOption({
            color: ['#ffb268', '#3eb1e9', '#4590ff', '#9faaff', '#9b74ff', '#fe8f60', '#f3ec7f', '#32d37e', '#51ebd0'],
            series: [
              // 主要展示层的
              {
                radius: radiusAee,
                center: ['50%', '55%'],
                hoverAnimation: false,
                type: 'pie',
                label: {
                  normal: {
                    show: true,
                    formatter: function(data) {
                      return data.name + '\n' + data.percent + '%'
                    },
                    textStyle: {
                      fontSize: getRem(14)
                    },
                    position: 'outside'
                  },
                  emphasis: {
                    show: true
                  }
                },
                labelLine: {
                  normal: {
                    show: true,
                    length: 15,
                    length2: 15
                  },
                  emphasis: {
                    show: true
                  }
                },
                data: scaleData
              },
              // 边框的设置
              {
                radius: ['0%', '0%'],
                center: ['50%', '50%'],
                type: 'pie',
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: false
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: false
                  }
                },
                animation: false,
                data: scaleData2
              }
            ],
            tooltip: {
              trigger: 'item',
              formatter: '{b} : {c}个 ({d}%)'
            }
          })
          this.echart = myChart
          const me = this
          myChart.off('click')
          myChart.on('click', (params) => {
            me.setEchartSelected(params.dataIndex, params.name)
          })
        }
      })
    },
    tableRowClick(data) {
      const name = data.name
      let index = -1
      for (let i = 0; i < this.scaleData.length; i++) {
        if (this.scaleData[i].name === name) {
          index = i
          i = this.scaleData.length
        }
      }
      if (index !== -1) {
        this.setEchartSelected(index, name)
      }
    },
    setEchartSelected(index, name, bool) {
      const option = this.echart.getOption()
      for (let i = 0; i < option.series[0].data.length; i++) {
        if (i === index && name && !option.series[0].data[index].selected) {
          option.series[0].data[i].selected = true
        } else {
          option.series[0].data[i].selected = false
        }
      }
      this.echart.setOption(option)
      if (name && option.series[0].data[index].selected) {
        this.$refs.singleTable.setCurrentRow(this.scaleData[index])
      } else {
        this.$refs.singleTable.setCurrentRow()
      }
      let trueName = name && option.series[0].data[index].selected ? this.selectValue : ''
      if (this.userInfo.district !== '3303' && (trueName === 'district' || trueName === 'DISTRICT')) {
        trueName = 'street'
      }
      this.$emit('itemBarClick', {
        key: trueName,
        value: name && option.series[0].data[index].selected ? name : '',
        refresh: true
      })
      this.$parent.$parent.$refs.checkItem.isLoading = true
      if (!bool) {
        const bar = this.$refs.bar
        if (bar.activeIndex !== -1) {
          bar.jump(bar.myData[bar.activeIndex], bar.activeIndex, true)
        }
      }
    },
    selectChange(value) {
      this.selectValue = value
      this.initEchart2()
      this.setEchartSelected(-1, '')
    },
    // 柱状图的改变事件
    barChange(data) {
      this.$emit('itemClick', {
        key: this.userInfo.district && this.userInfo.district.length > 4 ? 'street' : 'district',
        value: data.key,
        refresh: true
      })
      this.$parent.$parent.$refs.checkItem.isLoading = true
    },
    tabClick(index) {
      this.tabIndex = index
    },
    initIndex() {
      this.$refs.bar.activeIndex = -1
    }
  },
  watch: {
    currentOnePoint() {
      this.initData()
    },
    resize() {
      if (this.echart) {
        this.echart.resize()
      }
    }
  },
  components: {
    Bar
  }
}
</script>

<style scoped lang="less">
  .wrapper-echarts {
    .main-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .echart-bing {
        height: 100%;
        width: 100%;
      }
      .list {
        padding-top: 0.5rem;
        position: relative;
        height: 100%;
        .list-wrapper {
          height: 100%;
          width: 100%;
          position: relative;
        }
      }
    }
  }
  .echarts {
    width: 100%;
    height: 100%;
    visibility: hidden;
    &.active {
      visibility: visible;
      position: absolute !important;
      top: 0;
      left: 0;
    }
  }
  .wrapper-two {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    &.active {
      visibility: visible;
    }
  }
  .tags {
    border-radius: 0.05rem;
    overflow: hidden;
  }
  .tags > .tab {
    text-align: center;
    color: @color-text !important;
    border: none;
    background: #274369;
    border-radius: 0;
    cursor: pointer;
    &.active {
      background: @color-border-blue;
    }
  }
  .typeIndex {
    position: absolute;
    top: 0.05rem;
    left: 0;
    margin: 0.04rem;
    .item {
      cursor: pointer;
      width: 0.3rem;
      height: 0.3rem;
      position: relative;
      > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &:first-child {
        > img {
          width: 0.22rem;
          height: 0.19rem;
        }
        & + .item {
          > img {
            width: 0.2rem;
            height: 0.2rem;
          }
        }
      }
    }
  }
  .global-search {
    position: absolute;
    top: 0.05rem;
    right: 0;
    width: 1.6rem;
    margin: 0.04rem;
    border: 1px solid @color-border-blue;
    color: #00192E;
    border-radius: 0.15rem;
    outline: none;
    background: transparent;
  }
  /deep/ .el-tag {
    font-size: 0.16rem !important;
  }
  /deep/ .global-search {
    .el-select-dropdown {
      background: #43bafe;
      border: none;
    }
    .el-select-dropdown__empty {
      color: #fff;
    }
    .el-popper[x-placement^=bottom] .popper__arrow {
      border-bottom-color: #43bafe;
      &:after {
        border-bottom-color: #43bafe;
      }
    }
    .el-select-dropdown__item {
      color: #fff;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
      background-color: rgba(0, 122, 192, 0.6)
    }
    .el-input__inner {
      background: transparent;
      border: none;
      color: #fff;
      height: 0.3rem;
      &::placeholder {
        color: #43bafe;
      }
    }
    .el-input {
      position: relative;
    }
    .el-input__icon {
      line-height: 0.3rem;
      color: #43bafe;
    }
  }
  .table-box {
    border: 0.01rem solid #0d95c7;
    height: 100%;
    > div {
      height: 100%;
      width: 100%;
    }
    .table-content {
      height: 100%;
    }
  }
  /deep/ .el-table, .el-table__expanded-cell, /deep/ .el-table th, /deep/ .el-table tr {
    background: transparent;
  }
  /deep/ .el-table td {
    padding: 0.02rem 0;
    color: @color-text;
    font-size: 0.16rem;
  }
  /deep/ .el-table th {
    padding: 0.03rem 0;
    color: @color-text;
    background: @color-border-blue;
  }
  /deep/ .el-table td {
    border-bottom: 0.01rem dashed rgba(41, 97, 137, 0.8);
  }
  /deep/ .el-table th.is-leaf {
    border-bottom: 0;
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: transparent;
  }
  /deep/ .el-table .cell {
    .no-wrap()
  }
  /deep/ .el-table tr:hover, /deep/ .current-row {
    cursor: pointer;
    background: rgba(0, 122, 192, 0.6) !important;
  }
  /deep/ .current-row > td {
    background: transparent !important;
  }
  /deep/ .el-table tr:hover > td {
    border-bottom: 0.01rem dashed #083a5e;
  }
  /deep/ .el-table .cell {
    font-size: 0.16rem !important;
  }
  /deep/ .el-table::before {
    height: 0;
  }
</style>
