<template>
  <!--  <transition name="fade">-->
  <div class="map-around flex flex-y" v-show="isShow" :class="collapse2?'collapse':''">
    <div>
      <i class="close" @click="close"></i>
      <div class="title">空间查询</div>
    </div>
    <div class="tree-wrapper flex-1">
      <SpaceTree :data="treeData" @itemClick="itemClick"></SpaceTree>
    </div>
    <div class="table-wrapper" v-show="isShowTable" :style="{'height':maxHeight+'px'}">
      <i class="arrow" :style="{'top':top+'px'}"></i>
      <i class="close" @click="closeTable"></i>
      <SpaceTable :data="spaceTableData" @rowClick="rowClick"></SpaceTable>
    </div>
  </div>
  <!--  </transition>-->
</template>

<script>
import SpaceTree from './modules/space-tree'
import SpaceTable from './modules/space-table'
import { mapGetters } from 'vuex'

export default {
  name: 'Space',
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
          }
          i = one.length
        }
        if (index === -1) {
          one.push({
            key: ROOTNAME,
            name: ROOTNAME,
            data: [item],
            icon: item.properties.icon
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
              icon: item2.properties.icon
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
      allData: [],
      top: 0, // 箭头高度
      maxHeight: 0,
      isShow: false,
      isShowTable: false,
      treeData: [],
      spaceTableData: {}
    }
  },
  computed: {
    ...mapGetters('map', [
      'collapse2',
      'tree',
      'splitScreen'
    ])
  },
  mounted() {
  },
  methods: {
    // 具体某条信息被点击后
    rowClick(data) {
      this.$emit('rowClick', data)
    },
    // 树点击之后
    itemClick(data) {
      this.top = data.height
      this.maxHeight = this.$el.offsetHeight
      this.spaceTableData = data.data
      this.showTable()
    },
    close() {
      this.closeTable()
      this.isShow = false
      this.allData = []
      this.$emit('close', true)
    },
    closeTable() {
      this.isShowTable = false
    },
    show() {
      this.isShow = true
      this.closeTable()
    },
    showTable() {
      this.isShowTable = true
    }
  },
  components: {
    SpaceTree,
    SpaceTable
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
    line-height: 0.35rem;
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
</style>
