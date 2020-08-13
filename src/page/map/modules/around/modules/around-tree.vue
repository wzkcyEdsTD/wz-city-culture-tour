<template>
  <div class="around-tree">
    <el-tree
      ref="tree"
      show-checkbox
      :check-strictly="checkStrictly"
      default-expand-all
      node-key="key"
      :data="data"
      :props="defaultProps"
      :render-content="renderContent"
      @check="handleCheckChange"
      @node-click="nodeClick"
    >
    </el-tree>
  </div>
</template>

<script>

export default {
  name: 'AroundTree',
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
      this.$nextTick(() => {
        const arr = []
        data.forEach((item) => {
          arr.push(item.key)
        })
        this.$refs.tree.setCheckedKeys(arr)
      })
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        key: 'key'
      },
      checkStrictly: false
    }
  },
  mounted() {
  },
  methods: {
    getTreeNode(key) {
      return this.$refs.tree.getNode(key)
    },
    getTreeCheckKey() {
      return this.$refs.tree.getCheckedKeys()
    },
    getTreeCheckNodes() {
      return this.$refs.tree.getCheckedNodes()
    },
    setTreeCheckKey(arr) {
      this.$refs.tree.setCheckedKeys(arr)
    },
    // tree值的改变
    handleCheckChange(data) {
      const checkedKeysArr = this.$refs.tree.getCheckedKeys()
      const key = data.key
      const obj = JSON.parse(JSON.stringify(data))
      obj.checked = checkedKeysArr.indexOf(key) !== -1
      this.$emit('checkedItem', obj)
    },
    // tree值的改变
    nodeClick(data, node, el) {
      if (data.children && data.children.length) {
        return
      }
      const height = el.$el.offsetParent.offsetTop + el.$el.offsetTop // - (el.$el.offsetHeight / 2) + 15 相互抵消就不减了
      const newData = {
        data: data,
        height: height
      }
      this.$emit('itemClick', newData)
    },
    // 匹配图标
    chooseImg(text) {
      let str = ''
      if (text.level - 0 > 1) {
        str = text.data.icon
      }
      return str
    },
    // tree模版渲染
    renderContent(h, { node, data, store }) {
      /* eslint-disable */
      return (
        <span class='custom-tree-node'>
        <img class="icon" src={this.chooseImg(node)}/>
        <span>{node.label}{'['}{data.class?data.class+'类/':''}<span class = 'blod'>{data.num}{data.unit}</span>{']'}</span>
      <span class={data.sign?'sign':''}></span>
        <span>
        </span>
        </span>);
      /* eslint-disable */
    }
  }
}
</script>

<style scoped lang="less">
  .around-tree {
    // height: 1.8rem;
  }
  /deep/ .el-tree {
    background: transparent;
    color: #fff;
  }
  /deep/ .el-tree-node__content:hover {
    background-color: rgba(27, 147, 254, 0.4);
    cursor: pointer;
    /*background: transparent;*/
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content, /deep/ .el-tree-node:focus > .el-tree-node__content {
    background-color: rgba(27, 147, 254, 0.4) !important;
    /*background: transparent !important;*/
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
    margin-left: 0;
  }
  /deep/ .el-icon-caret-right:before {
    visibility: hidden;
  }
  /deep/ .el-tree-node__expand-icon.expanded {
    .bg-image('images/btn_shouqi');
    background-size: 0.14rem 0.14rem;
    transform: rotate(0);
    margin-left: 0;
  }
  /deep/ .el-tree-node__expand-icon.is-leaf {
    background: none;
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
    /deep/ .custom-tree-node{
      line-height: 0.2rem;
      display: block;
    }
    /deep/ .custom-tree-node > span:first-child {
      padding-right: 0.2rem;
    }
    /deep/ .custom-tree-node > .icon {
      width: 0.16rem;
      height: 0.16rem;
      margin-right: 0.02rem;
      position: relative;
      top: 0.03rem;
    }
  }
  /deep/ .el-checkbox__inner{
    width: 0.14rem;
    height: 0.14rem;
  }
</style>
