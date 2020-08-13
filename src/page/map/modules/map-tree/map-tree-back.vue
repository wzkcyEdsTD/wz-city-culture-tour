<template>
  <div class="map-tree">
    <el-tree
      ref="tree"
      show-checkbox
      :default-expanded-keys="defaultExpandedKeys"
      node-key="key"
      :data="treeData"
      :props="defaultProps"
      :render-content="renderContent"
      @check="handleCheckChange"
      @node-expand="nodeExpand"
      :class="treeContentHeight"
      :default-expand-all="defaultExpandAll"
    >
    </el-tree>
  </div>
</template>
<script>
import { getRoleCategory } from 'api/map/map'
import { mapActions, mapGetters } from 'vuex'
import { getSpecalNameFromTree } from 'common/js/util'
import $ from 'jquery'

export default {
  name: 'MapTree',
  props: {
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        key: 'key'
      },
      defaultExpandedKeys: [],
      t: null,
      treeContentHeight: '', // tree的内容区域的高度
      treeData: [],
      defaultExpandAll: false,
      isFirst: true
    }
  },
  computed: {
    ...mapGetters('map', [
      'currentMapType',
      'tree',
      'mapLoaded',
      'treeCheckedList',
      'specalTreeName'
    ])
  },
  mounted() {
    const me = this
    this.initData()
    window.showListInfo = function(key) {
      const data = me.$refs.tree.getNode(key).data
      let flag = -1
      for (let i = 0; i < me.treeCheckedList.length; i++) {
        if (me.treeCheckedList[i].key === data.key) {
          flag = i
          i = me.treeCheckedList.length
        }
      }
      if (flag === -1) {
        me.handleCheckChange(data)
      } else {
        me.$parent.$parent.$refs.checkItem.itemClick(flag)
      }
      me.$nextTick(() => {
        me.$emit('changeTitleBtn', true)
      })
    }
  },
  watch: {
    currentMapType(value, oldVale) {
      if ((value === 'juhe' && oldVale === 'sandian') || (oldVale === 'juhe' && value === 'sandian')) {
        return
      }
      this.isFirst = true
      this.initTreeData()
      this.initCheckedData()
    },
    specalTreeName() {
      this.initTreeData()
      this.initCheckedData()
    },
    search() {
      this.initTreeData()
      this.rollBack()
      this.initTreeHeight()
    }
  },
  beforeDestroy() {
    clearInterval(this.t)
    this.t = null
  },
  methods: {
    rollBack() {
      this.$nextTick(() => {
        const arr = []
        for (const i in this.treeCheckedList) {
          arr.push(this.treeCheckedList[i].key)
        }
        console.log('setCheckedKeys1')
        this.$refs.tree.setCheckedKeys(arr)
        this.initTreeHeight()
      })
    },
    initTreeData() {
      var newData = JSON.parse(JSON.stringify(this.tree))
      var newData2, newData3
      // 如果是四色图 需要做一下数据筛选
      if (this.currentMapType === 'fourColorMap') {
        for (var i = newData.length - 1; i >= 0; i--) {
          newData2 = newData[i].children || []
          for (var j = newData2.length - 1; j >= 0; j--) {
            newData3 = newData2[j].children || []
            for (var k = newData3.length - 1; k >= 0; k--) {
              if (newData3[k].sign !== true) {
                newData3.splice(k, 1)
              }
            }
            // 如果没有三级菜单 删掉二级菜单
            if (!newData3.length) {
              newData2.splice(j, 1)
            }
          }
          if (!newData2.length) {
            newData.splice(i, 1)
          }
        }
      }
      // 暂留别的地图类型 else if
      // 暂留搜索条件
      if (this.search !== '') {
        for (var ii = newData.length - 1; ii >= 0; ii--) {
          newData2 = newData[ii].children || []
          if (newData[ii].name.indexOf(this.search) !== -1) {
            continue
          }
          for (var jj = newData2.length - 1; jj >= 0; jj--) {
            newData3 = newData2[jj].children || []
            if (newData2[jj].name.indexOf(this.search) !== -1) {
              continue
            }
            if (newData3) {
              for (var kk = newData3.length - 1; kk >= 0; kk--) {
                if (newData3[kk].name.indexOf(this.search) === -1) {
                  newData3.splice(kk, 1)
                }
              }
              // 如果没有三级菜单 删掉二级菜单
              if (!newData3.length) {
                newData2.splice(jj, 1)
              }
            } else {
              if (newData2[jj].name.indexOf(this.search) === -1) {
                newData2.splice(jj, 1)
              }
            }
          }
          if (!newData2.length) {
            newData.splice(ii, 1)
          }
        }
        // this.SetMapLoaded(true)
        this.defaultExpandAll = true
        this.$nextTick(() => {
          setTimeout(() => {
            const el = document.querySelector('.el-tree-node__expand-icon.el-icon-caret-right')
            if (el && el.className.indexOf('expanded') === -1) {
              el.click()
            }
          }, 20)
        })
      } else {
        this.initCheckedData()
        this.defaultExpandAll = false
      }
      // 处理四色图数字不对的情况
      if (this.currentMapType === 'fourColorMap') {
        // 这是第一级
        for (let i = 0; i < newData.length; i++) {
          let oneClass = 0
          let oneNum = 0
          // 如果有二级
          if (newData[i].children) {
            for (let j = 0; j < newData[i].children.length; j++) {
              let twoClass = 0
              let twoNum = 0
              if (newData[i].children[j].children) {
                for (let k = 0; k < newData[i].children[j].children.length; k++) {
                  const item = newData[i].children[j].children[k]
                  if (item.num) {
                    twoNum += item.num
                  }
                }
                twoClass = newData[i].children[j].children.length
              }
              newData[i].children[j].class = twoClass
              newData[i].children[j].num = twoNum
              oneClass += twoClass
              oneNum += twoNum
            }
          }
          // 设置第一级的值
          newData[i].class = oneClass
          newData[i].num = oneNum
        }
      }
      this.treeData = newData
    },
    // 初始化数据
    initData() {
      getRoleCategory().then((data) => {
        this.SetTree(data)
        this.initTreeData()
        this.initCheckedData()
      })
    },
    // 初始化默认勾选数据
    initCheckedData() {
      const me = this
      if (this.t) {
        clearInterval(this.t)
      }
      this.t = setInterval(() => {
        if (me.mapLoaded) {
          clearInterval(me.t)
          me.t = null
          me.SetMapLoaded(false)
          // 从别的地方跳转过来，指定要勾选某项
          if (me.specalTreeName && me.currentMapType !== 'fourColorMap') {
            let node = getSpecalNameFromTree('name', me.specalTreeName, me.tree)
            if (node.num === 0 && node.geotype !== 'polygon') {
              node = null
              this.SetCollapse2(true)
            }
            if (node) {
              if (me.search === '') {
                me.DeleteTreeCheckedList()
              }
              console.log('setCheckedKeys2')
              me.$refs.tree.setCheckedKeys([node.key])
              me.handleCheckChange(node)
              me.defaultExpandedKeys = [node.key]
              this.clearSpecalTreeName()
              me.$nextTick(() => {
                me.initTreeHeight()
              })
            }
          } else if (me.specalTreeName && me.currentMapType === 'fourColorMap') {
            const node = getSpecalNameFromTree('name', me.specalTreeName, me.tree)
            if (me.search === '') {
              me.DeleteTreeCheckedList()
            }
            console.log('setCheckedKeys3')
            me.$refs.tree.setCheckedKeys([node.key])
            me.handleCheckChange(node)
            me.defaultExpandedKeys = [node.key]
            this.clearSpecalTreeName()
            me.$nextTick(() => {
              me.initTreeHeight()
            })
          } else {
            let node = me.treeData[0]
            if (node) {
              if (node.level - 0 === 1 && node.children.length) {
                // if (node.children[0].children && node.children[0].children.length > 0) {
                //   node = node.children[0].children[0]
                // } else {
                //   node = node.children[0]
                // }
                node = node.children[0]
              }
              if (me.search === '') {
                me.DeleteTreeCheckedList()
              }
              if (!(node.num === 0 && node.geotype !== 'polygon')) {
                console.log('setCheckedKeys4')
                if (me.isFirst) {
                  me.isFirst = false
                  if (node.level - 0 === 2 && node.children && node.children.length > 0) {
                    const arr = []
                    const childrenArr = []
                    for (let i = 0; i < node.children.length; i++) {
                      if (node.children[i].name !== '小流域' && node.children[i].name !== '山洪沟') {
                        arr.push(node.children[i].key)
                        childrenArr.push(node.children[i])
                      }
                    }
                    const newNode = JSON.parse(JSON.stringify(me.treeData[0].children[0]))
                    newNode.children = childrenArr
                    me.$refs.tree.setCheckedKeys(arr)
                    me.handleCheckChange(newNode)
                  } else {
                    me.$refs.tree.setCheckedKeys([node.key])
                    me.handleCheckChange(node)
                  }
                } else {
                  me.$refs.tree.setCheckedKeys([node.key])
                  me.handleCheckChange(node)
                }
                me.defaultExpandedKeys = [node.key]
              } else {
                me.SetCollapse2(true)
                me.defaultExpandedKeys = [me.treeData[0].key]
              }
              me.$nextTick(() => {
                me.initTreeHeight()
              })
            }
          }
        }
      }, 200)
    },
    ...mapActions('map', [
      'SetTree',
      'DeleteTreeCheckedList',
      'SetMapLoaded',
      'clearSpecalTreeName',
      'SetCollapse2',
      'SetTypeIndex'
    ]),
    getTreeNode(key) {
      return this.$refs.tree.getNode(key)
    },
    getTreeCheckKey() {
      return this.$refs.tree.getCheckedKeys()
    },
    getTreeCheckNodes() {
      return this.$refs.tree.getCheckedNodes()
    },
    setTreeCheckKey(arr, key) {
      // 获取移除的node
      const list = this.$refs.tree.getCheckedNodes()
      let obj
      list.forEach((val, k) => {
        if (val.key === key[0]) {
          obj = val
        }
      })
      console.log('setCheckedKeys5')
      this.$refs.tree.setCheckedKeys(arr)
      // 图标控制
      this.$emit('checkedItem', obj)
    },
    setCheckedNodes(arr) {
      this.$refs.tree.setCheckedNodes(arr)
    },
    clearCheck() {
      console.log('setCheckedKeys6')
      this.$refs.tree.setCheckedKeys([])
    },
    // tree值的改变
    handleCheckChange(data) {
      // 为0数据 走开
      if (data.geotype !== 'polygon' && data.num === 0 && data.level - 0 !== 2) {
        return
      }
      const obj = JSON.parse(JSON.stringify(data))
      const checkedArr = []
      this.treeCheckedList.forEach((item) => {
        checkedArr.push(item.key)
      })
      if (obj.level - 0 === 3) {
        obj.checked = checkedArr.indexOf(obj.key) === -1
        if (obj.children && obj.children.length) {
          obj.children.forEach((item) => {
            item.checked = obj.checked
          })
        }
      } else if (obj.level - 0 === 2) {
        obj.children = obj.children.filter((item) => {
          return !(item.geotype !== 'polygon' && item.num === 0)
        })
        const yesArr = [] // 已存在专题中的
        const noArr = [] // 不存在专题中的
        obj.children.forEach((item) => {
          if (checkedArr.indexOf(item.key) === -1) {
            item.checked = true
            noArr.push(item)
          } else {
            yesArr.push(item)
          }
        })
        obj.checked = noArr.length > 0
        // if (obj.checked) {
        //   obj.children = noArr
        // }
        if (obj.children && obj.children.length) {
          obj.children.forEach((item) => {
            item.checked = obj.checked
            if (item.children && item.children.length) {
              item.children.forEach((item2) => {
                item2.checked = obj.checked
              })
            }
          })
        }
      }
      this.$emit('checkedItem', obj)
      // 明天需要好好想想
      // const checkedKeysArr = this.$refs.tree.getCheckedKeys()
      // const checkedList = this.$refs.tree.getCheckedNodes()
      // const checkedListArr = []
      // for (let i = 0; i < checkedList.length; i++) {
      //   if (checkedList[i].num !== 0) {
      //     if (checkedList[i].level - 0 >= 3) {
      //       checkedListArr.push(checkedList[i].key)
      //     } else if (checkedList[i].level - 0 === 2) {
      //       for (let j = 0; j < checkedList[i].children.length; j++) {
      //         if (checkedList[i].children[j].num !== 0) {
      //           checkedListArr.push(checkedList[i].children[j].key)
      //           j = checkedList[i].children.length
      //         }
      //       }
      //     }
      //   }
      // }
      // this.$refs.tree.setCheckedKeys(checkedListArr)
      // this.initTreeHeight()
      // const key = data.key
      // const obj = JSON.parse(JSON.stringify(data))
      // if (obj.level - 0 >= 3) {
      //   obj.checked = checkedListArr.indexOf(key) !== -1
      // } else {
      //   obj.checked = true
      //   for (let i = 0; i < obj.children.length; i++) {
      //     if ((obj.children[i].num - 0 > 0 || obj.children[i].unit) && checkedListArr.indexOf(obj.children[i].key) === -1) {
      //       obj.checked = false
      //       i = obj.children.length
      //     }
      //   }
      // }
      // this.$emit('checkedItem', obj)
    },
    // tree模版渲染
    renderContent(h, { node, data, store }) {
      let remake = ''
      if (data.remake) {
        for (let i = 0; i < data.remake.length; i += 20) {
          remake += ('\n' + data.remake.slice(i, i + 20))
        }
      }
      let hasInfo = false
      // 如果是面
      if (data.level - 0 >= 3 && data.num !== 0) {
        if (data.geotype === 'polygon' && data.num === 0) {
          //  并且没有children
          if ((!data.children || (data.children && data.children.length === 0))) {
            // this.SetCollapse2(true)
            hasInfo = false
          } else if (data.children.length > 0) {
            let hasPoint = false
            for (let i = 0; i < data.children.length; i++) {
              if (data.children[i].geotype === 'point') {
                hasPoint = true
                i = data.children.length
              }
            }
            if (!hasPoint) {
              // this.SetCollapse2(true)
              hasInfo = false
            } else {
              // this.SetCollapse2(false)
              hasInfo = true
            }
            // 如果当前节点是面 并且有children 并且children没有点 隐藏
          } else {
            // this.SetCollapse2(false)
            hasInfo = true
          }
        } else {
          // this.SetCollapse2(false)
          hasInfo = true
        }
      } else {
        hasInfo = false
      }
      /* eslint-disable */
      return (
        <span class='custom-tree-node'>
        <span title={remake}>
        <span >{node.label}</span>
        <span>{data.class||data.num||data.geotype!=='polygon'?'[':''}
      {data.class && data.level - 0 < 3 ? data.class + '类/' : ''}
    <span class='blod'>{data.geotype!=='polygon'?data.num:(data.num?data.num:'')}
        </span>{data.class||data.num||data.geotype!=='polygon'?']':''}
        </span>
        </span>
        <span onclick={'showListInfo("'+node.key+'")'} class={hasInfo ? 'info' : '' }></span>
        <span class={data.sign && data.name != '地质灾害易发区'? 'sign' : '' }></span>
        </span>);

      /* eslint-disable */
    },
    nodeExpand(data) {
      let tree = this.$refs.tree
      if (data.level - 0 === 1) {
        let oneData = tree.store._getAllNodes().filter((item) => {
          return item.data.level - 0 === 1
        })
        for (var i = 0; i < oneData.length; i++) {
          if (oneData[i].data.key !== data.key) {
            oneData[i].expanded = false
          } else {
            oneData[i].childNodes[0].expanded = true
          }
        }
      }
      this.initTreeHeight()
    },
    initTreeHeight() {
      this.$nextTick(() => {
        const el = this.$refs.tree.$el
        const total = parseInt(window.getComputedStyle(el).height)
        const len = el.children.length - 1
        this.treeContentHeight = 'accordion' + len
        const oneHeight = parseInt(window.getComputedStyle(el.children[0].children[0]).height)
        const contentHeight = total - oneHeight * len
        // const contentEl = document.querySelectorAll('.map-tree>.el-tree>.el-tree-node>.el-tree-node__children')
        // contentEl.forEach((item, index) => {
        // item.style.height = contentHeight + 'px'
        // })
        $('.map-tree>.el-tree>.el-tree-node>.el-tree-node__children').on('click', function(e) {
          e.stopPropagation()
        })
        var elItem = $('.el-tree-node__content')
        for (let i = 0; i < elItem.length; i++) {
          if (getComputedStyle(elItem[i].children[0]).backgroundImage !== 'none') {
            continue
          }
          let itemEl = elItem[i].children[2].children[0].children[1].children[0]
          var num = itemEl.innerText
          if (num === '0') {
            elItem[i].children[1].children[0].children[1].disabled = true
            elItem[i].children[1].className = 'el-checkbox disabled'
          } else {
            elItem[i].children[1].children[0].children[1].disabled = false
            elItem[i].children[1].className = 'el-checkbox'
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
  .map-tree {
    height: 100%;
  }
  /deep/ .el-tree {
    background: transparent;
    color: #fff;
  }
  /deep/ .el-tree-node__content:hover {
    background-color: rgba(27, 147, 254, 0.4);
    background: transparent;
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content, /deep/ .el-tree-node:focus > .el-tree-node__content {
    background-color: rgba(27, 147, 254, 0.4) !important;
    background: transparent !important;
  }
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    .bg-image('images/btn_checked');
    border: none;
  }
  /deep/ .el-checkbox__inner {
    .bg-image('images/btn_kong');
    border: none;
  }
  /deep/ .el-checkbox__inner::after {
    display: none;
  }
  /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
    .bg-image('images/btn_zhankai');
    background-size: 0.14rem 0.14rem;
    margin-left: 0.04rem;
    margin-right: 0.04rem;
  }
  /deep/ .el-icon-caret-right:before {
    visibility: hidden;
  }
  /deep/ .el-tree-node__expand-icon.expanded {
    .bg-image('images/btn_shouqi');
    background-size: 0.14rem 0.14rem;
    transform: rotate(0);
    margin-left: 0.04rem;
    margin-right: 0.04rem;
  }
  /deep/ .el-tree-node__expand-icon.is-leaf {
    background: none;
  }
  /deep/ .custom-tree-node {
    font-size: 0.18rem;
  }
  /deep/ .custom-tree-node span {
    font-size: 0.16rem;
  }
  /deep/ .el-tree-node__content {
    height: 0.3rem;
  }
  /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border: none;
    .bg-image('images/btn_have');
  }
  /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    visibility: hidden;
  }
  /deep/ .el-tree-node .is-hidden {
    display: block !important;
  }
  /deep/ .blod {
    color: @color-text-hover;
  }
  /deep/ .el-tree > .el-tree-node > .el-tree-node__content > .el-checkbox {
    display: none;
  }
  /deep/ .el-tree-node {
    font-size: @font-size-medium-x;
  }
  /deep/ .el-tree-node .el-tree-node {
    font-size: @font-size-medium;
  }
  /deep/ .el-tree-node .el-tree-node .el-tree-node {
    font-size: @font-size-small;
  }
  /deep/ .el-tree-node__content > label.el-checkbox {
    margin-top: 0.03rem;
  }
  /deep/ .el-tree-node__content {
    cursor: default;
    position: relative;
    /deep/ .sign {
      display: block;
      width: 0.14rem;
      height: 0.14rem;
      background: url('./images/riskFourMap.png') no-repeat center;
      background-size: 100% 100%;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
    /deep/ .info {
      display: block;
      width: 0.14rem;
      height: 0.14rem;
      background: url('../../images/table_blue.png') no-repeat center;
      background-size: 100% 100%;
      position: absolute;
      right: 0.18rem;
      top: 50%;
      transform: translate(0, -50%);
      cursor: pointer;
    }
    /deep/ .custom-tree-node > span:first-child {
      padding-right: 0.3rem;
      line-height: 0.24rem;
    }
  }
  /deep/ .el-checkbox__inner {
    width: 0.14rem;
    height: 0.14rem;
  }
  // 隐藏4级菜单
  /deep/ .el-tree .el-tree-node .el-tree-node .el-tree-node .el-tree-node__children {
    display: none !important;
  }
  /deep/ .el-tree .el-tree-node .el-tree-node .el-tree-node > .el-tree-node__content > .el-tree-node__expand-icon {
    background: none !important;
    cursor: default !important;
  }
  /deep/ .el-checkbox.disabled {
    opacity: .3;
    cursor: default !important;
    > .el-checkbox__input {
      cursor: default !important;
    }
  }
  /deep/ .custom-tree-node {
    width: 2.55rem;
    > span {
      width: 100%;
      display: block;
      > span:first-child {
        float: left;
        .no-wrap();
        max-width: 1.6rem;
      }
    }
  }
  // 后加的
  /deep/ .el-tree {
    height: 100%;
    overflow: hidden;
    > .el-tree-node {
      > .el-tree-node__content {
        /*background: #43bafe;*/
        box-shadow: inset 0 0 0.1rem #43bafe;
      }
    }
    > .is-expanded > .el-tree-node__children {
      overflow-x: hidden;
      overflow-y: auto;
    }
    &.accordion1 > .is-expanded > .el-tree-node__children {
      height: 785px !important;
    }
    &.accordion2 > .is-expanded > .el-tree-node__children {
      height: 755px !important;
    }
    &.accordion3 > .is-expanded > .el-tree-node__children {
      height: 725px !important;
    }
    &.accordion4 > .is-expanded > .el-tree-node__children {
      height: 695px !important;
    }
    &.accordion5 > .is-expanded > .el-tree-node__children {
      height: 665px !important;
    }
    &.accordion6 > .is-expanded > .el-tree-node__children {
      height: 635px !important;
    }
    &.accordion7 > .is-expanded > .el-tree-node__children {
      height: 605px !important;
    }
    &.accordion8 > .is-expanded > .el-tree-node__children {
      height: 575px !important;
    }
    &.accordion9 > .is-expanded > .el-tree-node__children {
      height: 545px !important;
    }
    &.accordion10 > .is-expanded > .el-tree-node__children {
      height: 515px !important;
    }
    &.accordion11 > .is-expanded > .el-tree-node__children {
      height: 485px !important;
    }
    &.accordion12 > .is-expanded > .el-tree-node__children {
      height: 455px !important;
    }
    &.accordion13 > .is-expanded > .el-tree-node__children {
      height: 425px !important;
    }
    &.accordion14 > .is-expanded > .el-tree-node__children {
      height: 395px !important;
    }
    &.accordion15 > .is-expanded > .el-tree-node__children {
      height: 365px !important;
    }
  }
  @media screen and (min-height: 1080px) {
    /deep/ .el-tree {
      &.accordion1 > .is-expanded > .el-tree-node__children {
        height: 918px !important;
      }
      &.accordion2 > .is-expanded > .el-tree-node__children {
        height: 888px !important;
      }
      &.accordion3 > .is-expanded > .el-tree-node__children {
        height: 858px !important;
      }
      &.accordion4 > .is-expanded > .el-tree-node__children {
        height: 828px !important;
      }
      &.accordion5 > .is-expanded > .el-tree-node__children {
        height: 798px !important;
      }
      &.accordion6 > .is-expanded > .el-tree-node__children {
        height: 768px !important;
      }
      &.accordion7 > .is-expanded > .el-tree-node__children {
        height: 738px !important;
      }
      &.accordion8 > .is-expanded > .el-tree-node__children {
        height: 708px !important;
      }
      &.accordion9 > .is-expanded > .el-tree-node__children {
        height: 678px !important;
      }
      &.accordion10 > .is-expanded > .el-tree-node__children {
        height: 648px !important;
      }
      &.accordion11 > .is-expanded > .el-tree-node__children {
        height: 618px !important;
      }
      &.accordion12 > .is-expanded > .el-tree-node__children {
        height: 588px !important;
      }
      &.accordion13 > .is-expanded > .el-tree-node__children {
        height: 558px !important;
      }
      &.accordion14 > .is-expanded > .el-tree-node__children {
        height: 528px !important;
      }
      &.accordion15 > .is-expanded > .el-tree-node__children {
        height: 498px !important;
      }
    }
  }
  // 屏幕适配1620
  @media screen and (min-height: 1620px) {
    /deep/ .el-tree {
      &.accordion1 > .is-expanded > .el-tree-node__children {
        height: 1458px !important;
      }
      &.accordion2 > .is-expanded > .el-tree-node__children {
        height: 1428px !important;
      }
      &.accordion3 > .is-expanded > .el-tree-node__children {
        height: 1398px !important;
      }
      &.accordion4 > .is-expanded > .el-tree-node__children {
        height: 1368px !important;
      }
      &.accordion5 > .is-expanded > .el-tree-node__children {
        height: 1338px !important;
      }
      &.accordion6 > .is-expanded > .el-tree-node__children {
        height: 1308px !important;
      }
      &.accordion7 > .is-expanded > .el-tree-node__children {
        height: 1278px !important;
      }
      &.accordion8 > .is-expanded > .el-tree-node__children {
        height: 1248px !important;
      }
      &.accordion9 > .is-expanded > .el-tree-node__children {
        height: 1218px !important;
      }
      &.accordion10 > .is-expanded > .el-tree-node__children {
        height: 1188px !important;
      }
      &.accordion11 > .is-expanded > .el-tree-node__children {
        height: 1158px !important;
      }
      &.accordion12 > .is-expanded > .el-tree-node__children {
        height: 1128px !important;
      }
      &.accordion13 > .is-expanded > .el-tree-node__children {
        height: 1098px !important;
      }
      &.accordion14 > .is-expanded > .el-tree-node__children {
        height: 1068px !important;
      }
      &.accordion15 > .is-expanded > .el-tree-node__children {
        height: 1038px !important;
      }
    }
  }
</style>
