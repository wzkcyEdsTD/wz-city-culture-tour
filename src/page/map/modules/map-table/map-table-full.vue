<template>
  <div class="wrapper" :class="{'isSmall':isSmall,'collapse':collapse1}" ref="wrapper">
    <ItemTitle
      v-drag
      draggable="false"
      :title="this.currentOnePoint?this.currentOnePoint.name:''"
      color="#67c23a"
      placeholder="名称搜索"
      @search="tableSearch">
    </ItemTitle>
    <i class="close" @click="close"></i>
    <i class="small" @click="small"></i>
    <div class="table-box" :id="myUuid">
      <div ref="table">
        <el-table
          ref="singleTable"
          height="100%"
          @row-click="rowClick"
          highlight-current-row
          class="table-content"
          :data="tableData">
          <el-table-column
            prop="index"
            label="序号"
            align="center"
            header-align="center"
            width="70"
          >
          </el-table-column>
          <!--          :width="item.key.length*16+30"-->
          <el-table-column
            show-overflow-tooltip
            align="center"
            :key="index"
            v-for="(item,index) in collmns"
            :prop="item.value"
            :label="item.key"
            :width="210"
            header-align="center">
            <template slot-scope="scope">
              <span>{{scope.row[item.value]===''||scope.row[item.value]===undefined||scope.row[item.value]===null? '':scope.row[item.value]}}</span>
            </template>
          </el-table-column>
          <template slot="append">
            <div v-show="pageSize === count && count>0" class="loading"></div>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTitle from 'components/item-title/item-title'
import { mapGetters } from 'vuex'
import { likeStatisticsAll } from 'api/map/map'
import $ from 'jquery'
import { uuid } from 'common/js/util'

export default {
  name: 'ItemTable',
  props: {
    search: {
      type: String,
      default: ''
    },
    exactBarQuery: {
      type: Object,
      default() {
        return {
          key: '',
          value: ''
        }
      }
    },
    exactQuery: {
      type: Object,
      default() {
        return {
          key: '',
          value: ''
        }
      }
    }
  },
  data() {
    return {
      myUuid: 'uuid' + uuid(),
      flag: true,
      pageNo: 1, // 从第几条开始查
      pageSize: 20, // 每页条数
      tableData: [], // 后台传入的数据
      collmns: [],
      value: '',
      count: 0,
      isSmall: false
    }
  },
  directives: {
    drag(el, binding) {
      const oDiv = el // 当前元素
      // 禁止选择网页上的文字
      oDiv.onselectstart = function() {
        return false
      }
      oDiv.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - oDiv.parentNode.offsetLeft
        const disY = e.clientY - oDiv.parentNode.offsetTop
        document.onmousemove = (e) => {
          // 通过事件委托，计算移动的距离
          const l = e.clientX - disX
          const t = e.clientY - disY
          // 移动当前元素
          oDiv.parentNode.style.left = l + 'px'
          oDiv.parentNode.style.top = t + 'px'
        }
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
        }
        // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
        return false
      }
    }
  },
  computed: {
    ...mapGetters('map', [
      'currentOnePoint',
      'collapse1'
    ]),
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    tableData() {
      if (this.tableData.length < this.pageSize + this.pageNo - 1) {
        this.flag = false
      } else {
        this.flag = true
      }
    },
    currentOnePoint() {
      this.init()
    },
    exactBarQuery(data) {
      if (data.refresh) {
        this.init()
      }
    },
    exactQuery(data) {
      if (data.refresh) {
        this.init()
      }
    },
    search() {
      this.init()
    }
  },
  methods: {
    // 表格的搜索值
    tableSearch(value) {
      this.value = value
      this.init()
    },
    close() {
      this.$emit('close', false)
    },
    small() {
      this.isSmall = !this.isSmall
      this.$refs.wrapper.style = null
    },
    init() {
      // 初始化配置
      this.pageNo = 1
      this.tableData = []
      // 获取第一次数据
      this.initData()
      this.$nextTick(() => {
        setTimeout(() => {
          $('#' + this.myUuid + ' .el-table__body-wrapper').off('scroll')
          $('#' + this.myUuid + ' .el-table__body-wrapper').on('scroll', () => {
            var dom = $('#' + this.myUuid + ' .el-table__body-wrapper')[0]
            if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight - 50) {
              if (this.flag) {
                this.flag = false
                this.pageNo = this.pageNo + this.pageSize
                this.initData()
              }
            }
          })
        }, 300)
      })
    },
    initData() {
      if (this.currentOnePoint && this.currentOnePoint.datasetname) {
        const showFileds = [...this.currentOnePoint.showField]
        if (this.userInfo.district && this.userInfo.district.length > 4) {
          const index1 = showFileds.indexOf('DISTRICT')
          if (index1 !== -1) {
            showFileds[index1] = 'street'
          }
          const index2 = showFileds.indexOf('distract')
          if (index2 !== -1) {
            showFileds[index2] = 'street'
          }
        }
        likeStatisticsAll(this.search, showFileds, this.exactQuery.key, this.exactQuery.value, this.exactBarQuery.key, this.exactBarQuery.value, this.pageNo, this.pageSize, this.currentOnePoint.datasetname.split(':')[1], this.userInfo.district, this.currentOnePoint.sql, showFileds[showFileds.length - 1], this.value).then((data) => {
          if (!this.currentOnePoint || !data) {
            this.count = 0
            return
          }
          const newData = data.values
          this.count = data.values.length
          this.collmns = data.collmns
          if (newData.length) {
            for (var i = 0; i < newData.length; i++) {
              newData[i].index = this.pageNo + i
            }
            if (this.pageNo === 1) {
              this.tableData = newData
            } else {
              this.tableData = [...this.tableData, ...newData]
            }
          }
        })
      }
    },
    rowClick(data) {
      data._mapPopField = this.currentOnePoint.mapPopField
      data._mapPopName = this.currentOnePoint.mapPopName
      // data.latitude = '28.1115972222222'
      // data.longitude = '120.427363888889'
      // data.table_name = this.currentOnePoint.datasetname.split(':')[1]
      // data.smid = 1873
      this.$emit('rowClick', data)
      if (data.latitude && data.longitude) {
        this.isSmall = true
        this.$refs.wrapper.style = ''
      }
    },
    clearCurrentTableRow() {
      this.$refs.singleTable.setCurrentRow()
    }
  },
  components: {
    ItemTitle
  }
}
</script>

<style scoped lang="less">
  /deep/ .item-title {
    width: 95%;
  }
  .wrapper {
    position: fixed !important;
    top: 50%;
    left: 50%;
    width: 70%;
    z-index: 99999;
    transform: translate(-50%, -50%);
    background: rgba(6, 37, 55, 1);
    .close {
      position: absolute;
      right: 0.07rem;
      top: 0.07rem;
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
    .small {
      position: absolute;
      right: 0.37rem;
      top: 0.05rem;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('../../images/up');
      transform-origin: 50% 50%;
      transform: rotate(-45deg);
      cursor: pointer;
    }
    &.isSmall {
      width: auto;
      .item-title {
        margin-bottom: 0;
        width: 100%;
        /deep/ .search-wrapper {
          display: none;
        }
        /deep/ .text {
          float: left;
          margin-right: 0.45rem;
        }
      }
      .table-box {
        display: none;
      }
      .small {
        transform: rotate(135deg);
        top: 0.1rem;
        right: 0.35rem;
      }
      transform: translate(0, 0);
      top: 1rem;
      left: 4.7rem;
      &.collapse {
        left: 0.75rem;
      }
    }
  }
  .loading {
    width: 100%;
    height: 0.2rem;
    background: url("images/loading.gif") no-repeat center;
  }
  .table-box {
    border: 0.01rem solid #0d95c7;
    width: 100%;
    min-height: 5rem;
    position: relative;
    > div {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
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
    background: rgba(3, 67, 106, 1);
  }
  /deep/ .el-table td {
    border-bottom: 0.01rem dashed rgba(41, 97, 137, 0.8);
    background: rgba(6, 37, 55, 1);
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
  /deep/ .el-table__body tr.hover-row.current-row > td,
  /deep/ .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
  /deep/ .el-table__body tr.hover-row.el-table__row--striped > td,
  /deep/ .el-table__body tr.hover-row > td {
    background: rgba(0, 122, 192, 0.6) !important;
  }
  /deep/ .el-table__fixed-right::before, /deep/ .el-table__fixed::before {
    display: none;
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
  /deep/ *::-webkit-scrollbar {
    width: 10px;
    height: 10px
  }
  /deep/ *::-webkit-scrollbar-thumb {
    border-radius: 0;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #1888cf !important;
  }
  /deep/ *::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(46, 151, 217, 0.4) !important;
  }
  /deep/ .search-wrapper .search-box-move {
    width: 20%;
    float: right;
  }

</style>
