<template>
  <!--  <transition name="fade">-->
  <div class="map-around flex flex-y" v-show="isShow" :class="collapse2?'collapse':''">
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
    <div v-show="tabIndex===0">
      <div>
        <i class="close" @click="close"></i>
        <div class="title">距离范围</div>
        <div class="select-wrapper flex">
          <el-select class="flex-1" v-model="selectValue" placeholder="请选择" :popper-append-to-body="appendBody">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button class="submit" type="primary" plain @click="selectChange">确定</el-button>
        </div>
      </div>
      <div class="tree-wrapper flex-1">
        <AroundTree :data="treeData" @itemClick="itemClick" @checkedItem="checkedItem"></AroundTree>
      </div>
      <div class="table-wrapper" v-show="isShowTable" :style="{'height':maxHeight+'px'}">
        <i class="arrow" :style="{'top':top+'px'}"></i>
        <i class="close" @click="closeTable"></i>
        <AroundTable :data="spaceTableData" @rowClick="rowClick"></AroundTable>
      </div>
    </div>
    <AroundAnalyse ref="aroundAnalyse" @rowClick="rowClick" @close="close" v-show="tabIndex===1"></AroundAnalyse>
  </div>
  <!--  </transition>-->
</template>

<script>
import AroundTree from './modules/around-tree'
import AroundTable from './modules/around-table'
import AroundAnalyse from './modules/around-analyse'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Around',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    data(data) {
      this.allData = [...this.allData, ...data]
      var one = []
      this.allData.forEach((item) => {
        const ROOTNAME = item.properties.ROOTNAME
        var index = -1
        for (var i = 0; i < one.length; i++) {
          if (one[i].name === ROOTNAME) {
            one[i].data.push(item)
            index = i
            break
          }
          // i = one.length
        }
        if (index === -1) {
          one.push({
            key: ROOTNAME,
            name: ROOTNAME,
            data: [item],
            icon: item.properties.icon,
            alias: item.properties.alias
          })
        }
      })
      // 计算大类有几个
      one.forEach((item) => {
        item.num = item.data.length
        item.unit = '个'
        item.children = []
        var two = []
        item.data.forEach((item2, index) => {
          const DATATYPE = item2.properties.DATATYPE
          if (two.indexOf(DATATYPE) === -1) {
            two.push(DATATYPE)
            item.children.push({
              key: DATATYPE,
              name: DATATYPE,
              unit: '个',
              data: [item2],
              icon: item2.properties.icon,
              alias: item2.properties.alias
            })
          } else {
            item.children[two.indexOf(DATATYPE)].data.push(item2)
          }
        })
        item.children.forEach((item3) => {
          item3.num = item3.data.length
        })
        item.class = item.children.length
      })
      this.treeData = one
    },
    splitScreen() {
      if (this.splitScreen) {
        this.close()
      }
    }
  },
  data() {
    return {
      tabArr: ['周边分析', '就近分析'], // tab标签个数
      tabIndex: 0,
      allData: [],
      appendBody: false,
      top: 0, // 箭头高度
      maxHeight: 0,
      isShow: false,
      isShowTable: false,
      spaceTableData: {},
      selectValue: 1000,
      selectOptions: [
        { label: '1000米', value: 1000 },
        { label: '3000米', value: 3000 },
        { label: '5000米', value: 5000 },
        { label: '10000米', value: 10000 }
      ],
      treeData: []
    }
  },
  computed: {
    ...mapGetters('map', [
      'collapse2',
      'tree',
      'splitScreen'
    ])
  },
  methods: {
    tabClick(index) {
      this.tabIndex = index
      // if (this.tabIndex !== 0) {
      //   this.closeTable()
      //   const obj = {
      //     km: this.selectValue,
      //     data: 'close'
      //   }
      //   this.allData = []
      //   this.$emit('selectChange', obj)
      // }
      if (index === 0) {
        this.$parent.$refs.baseMap.clearNearbyAnalysisLayer()
      } else if (index === 1) {
        this.$parent.$refs.baseMap.clearAroundAnalysisLayer()
      }
    },
    // 树勾选的有效数据
    checkedItem(data) {
      const obj = {
        km: this.selectValue,
        data: data
      }
      this.allData = []
      this.$emit('selectChange', obj)
    },
    // 具体某条信息被点击后
    rowClick(data) {
      this.$emit('rowClick', data)
    },
    // 递归查找
    findDataFromTree(key, value, list) {
      list.filter((item) => {
        if (item[key] === value) {
          this.lists.push(item)
        } else {
          if (item.children && item.children.length) {
            return this.findDataFromTree(key, value, item.children)
          }
        }
      })
    },
    // 树点击之后
    itemClick(data) {
      this.top = data.height
      this.maxHeight = this.$el.offsetHeight
      this.spaceTableData = data.data
      this.showTable()
    },
    // 距离改变
    selectChange() {
      const obj = {
        km: this.selectValue,
        data: 'all'
      }
      this.allData = []
      this.$emit('selectChange', obj)
    },
    close() {
      this.closeTable()
      this.isShow = false
      const obj = {
        km: this.selectValue,
        data: 'close'
      }
      this.allData = []
      this.$emit('selectChange', obj)
    },
    allClose() {
      this.isShow = false
      this.isShowTable = false
    },
    closeTable() {
      this.isShowTable = false
    },
    show() {
      this.isShow = true
      this.closeTable()
      this.SetCollapse2(true)
    },
    showAnalyse(centerCoordinates) {
      this.tabIndex = 1
      this.show()
      // this.$refs.aroundAnalyse.init(centerCoordinates)
    },
    showTable() {
      this.isShowTable = true
    },
    ...mapActions('map', [
      'SetCollapse2'
    ])
  },
  components: {
    AroundTree,
    AroundTable,
    AroundAnalyse
  }
}
</script>

<style scoped lang="less">
  .table-wrapper {
    width: 3.6rem;
    /*height: 3rem;*/
    position: absolute;
    right: 103%;
    top: 0;
    background: #24649A;
    .arrow {
      position: absolute;
      top: 0;
      left: 100%;
      width: 0.08rem;
      height: 0.3rem;
      display: block;
      &:before {
        content: '';
        display: block;
        width: 0;
        height: 0;
        top: 0.05rem;
        position: relative;
        border-top: 0.1rem solid transparent;
        border-left: 0.08rem solid #24649A;
        border-bottom: 0.1rem solid transparent;
      }
    }
    .close {
      top: 0.05rem !important;
      right: 0.05rem !important;
      z-index: 99;
    }
  }
  .tree-wrapper {
    overflow: auto;
    padding: 0.05rem 0;
  }
  .select-wrapper {
    padding-top: 0.1rem;
    padding-bottom: 0.15rem;
    position: relative;
    &:after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 3.6rem;
      height: 0.01rem;
      background: #fff;
      transform: translate(-50%, 0);
    }
  }
  .submit {
    margin-left: 0.1rem;
  }
  .title {
    height: 0.35rem;
    line-height: 0.5rem;
    color: #fff;
    font-size: 0.18rem;
    padding: 0 0.1rem;
  }
  .map-around {
    opacity: 1;
    width: 3.6rem;
    position: absolute;
    min-height: 1rem;
    max-height: calc(100% - 0.1rem);
    right: 4rem;
    top: 0.05rem;
    z-index: 1;
    background: rgba(38, 104, 159, 0.95);
    padding: 0.1rem;
    transition: all .3s linear;
    &.collapse {
      right: 0.14rem;
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
  /deep/ .el-input__inner, /deep/ .el-select-dropdown__item {
    height: 0.3rem;
    line-height: 0.3rem;
  }
  /deep/ .el-input__icon {
    line-height: 0.3rem;
  }
  /deep/ .el-button {
    height: 0.3rem;
    line-height: 0.3rem;
    padding: 0 0.15rem;
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
</style>
