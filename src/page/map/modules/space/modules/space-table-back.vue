<template>
  <div class="table-box">
    <div ref="table">
      <el-table
        v-if="currentOnePoint && currentOnePoint.showField"
        height="100%"
        @row-click="rowClick"
        class="table-content"
        :data="newData">
        <el-table-column
          prop="index"
          label="序号"
          align="center"
          header-align="center"
          width="50"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :key="index"
          align="center"
          v-for="(item,index) in data.showField"
          :prop="item"
          :label="data.showHeader[index]"
          header-align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ItemTable',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tableData: [
        {
          index: 1,
          DISTRICT: 1,
          ENGINEER_NAME: 1
        }
      ] // 后台传入的数据
    }
  },
  computed: {
    newData() {
      const arr = []
      if (this.data.data) {
        this.data.data.forEach((item, index) => {
          const newItem = item.properties
          newItem.index = index + 1
          arr.push(newItem)
        })
      }
      return arr
    },
    ...mapGetters('map', [
      'currentOnePoint'
    ])
  },
  methods: {
    rowClick(data) {
      this.$emit('rowClick', data)
    },
    ...mapActions('map', [
      'SetEnterprise'
    ])
  }
}
</script>

<style scoped lang="less">
  .table-box {
    border: 1px solid #0d95c7;
    height: 100%;
    > div {
      height: 100%;
      width: 100%;
    }
    .table-content {
      height: 100%;
    }
  }
  /deep/ .el-table::before {
    display: none;
  }
  /deep/ .el-table, .el-table__expanded-cell, /deep/ .el-table th, /deep/ .el-table tr {
    background: transparent;
  }
  /deep/ .el-table td {
    padding: 2px 0;
    color: @color-text;
  }
  /deep/ .el-table th {
    padding: 3px 0;
    color: @color-text;
    background: @color-border-blue;
  }
  /deep/ .el-table td {
    border-bottom: 1px dashed #083a5e;
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
  /deep/ .el-table tr:hover {
    cursor: pointer;
    background: @color-border-blue;
  }
  /deep/ .el-table tr:hover > td {
    border-bottom: 1px solid @color-border-blue;
  }
</style>
