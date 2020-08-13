<template>
  <div class="table-box">
    <div ref="table">
      <el-table
        height="100%"
        @row-click="rowClick"
        class="table-content"
        :data="newData">
        <el-table-column
          prop="index"
          label="序号"
          align="center"
          header-align="center"
          width="55"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          :prop="userInfo.district && userInfo.district.length>4?'STREET':'DISTRICT'"
          label="区域"
          header-align="center"
          width="70"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="NAME"
          label="名称"
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
    ]),
    ...mapGetters([
      'userInfo'
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
  /deep/ .el-table::before {
    display: none;
  }
  /deep/ .el-table, .el-table__expanded-cell, /deep/ .el-table th, /deep/ .el-table tr {
    background: transparent;
  }
  /deep/ .el-table td {
    padding: 0.02rem 0;
    color: @color-text;
  }
  /deep/ .el-table th {
    padding: 0.03rem 0;
    color: @color-text;
    background: @color-border-blue;
  }
  /deep/ .el-table td {
    border-bottom: 0.01rem dashed #083a5e;
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
    background: rgba(0, 122, 192, 0.6);
  }
  /deep/ .el-table tr:hover > td {
    border-bottom: 0.01rem dashed #083a5e;
  }
</style>
