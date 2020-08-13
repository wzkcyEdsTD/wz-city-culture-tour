<template>
  <div class="table-box" :id="myUuid">
    <div ref="table">
      <el-table
        ref="singleTable"
        v-if="currentOnePoint && currentOnePoint.showField"
        height="100%"
        @row-click="rowClick"
        highlight-current-row
        class="table-content"
        :data="tableData"
      >
        <el-table-column prop="index" label="序号" align="left" header-align="center" width="60">
          <template slot-scope="scope">
            <span class="icon-wrapper">
              <img v-if="scope.row.latitude" src="./images/map1.png" />
              <img v-else src="./images/map2.png" />
              <span>{{scope.row.index}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          :prop="areaProp"
          :label="currentOnePoint.showHeader&&currentOnePoint.showHeader[0].toLowerCase()"
          :width="userInfo.district && userInfo.district.length>4?85:70"
          header-align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          :prop="currentOnePoint.showField&&currentOnePoint.showField[1].toLowerCase()"
          :label="currentOnePoint.showHeader&&currentOnePoint.showHeader[1].toLowerCase()"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row[(currentOnePoint.showField && currentOnePoint.showField[1].toLowerCase())] || '暂无信息'}}</span>
          </template>
        </el-table-column>
        <template slot="append">
          <div v-show="tableData.length<count" class="loading"></div>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { likeStatistics } from "api/map/map";
import $ from "jquery";
import { uuid } from "common/js/util";

export default {
  name: "ItemTable",
  props: {
    search: {
      type: String,
      default: ""
    },
    exactBarQuery: {
      type: Object,
      default() {
        return {
          key: "",
          value: ""
        };
      }
    },
    exactQuery: {
      type: Object,
      default() {
        return {
          key: "",
          value: ""
        };
      }
    }
  },
  data() {
    return {
      myUuid: "uuid" + uuid(),
      flag: true,
      pageNo: 1, // 从第几条开始查
      pageSize: 20, // 每页条数
      tableData: [], // 后台传入的数据
      count: 0 // 总条数
    };
  },
  computed: {
    ...mapGetters("map", ["currentOnePoint"]),
    ...mapGetters(["userInfo"]),
    areaProp() {
      let res =
        this.currentOnePoint.showField &&
        this.currentOnePoint.showField[0].toLowerCase() === "district"
          ? this.userInfo.district && this.userInfo.district.length > 4
            ? "street"
            : "district"
          : this.currentOnePoint.showField[0].toLowerCase();
      if (
        this.currentOnePoint.level - 0 === 3 &&
        this.currentOnePoint.name.lastIndexOf("专家") ===
          this.currentOnePoint.name.length - 2
      ) {
        const parentNodeData = this.$parent.$parent.$refs.tree.getTreeNode(
          this.currentOnePoint.key
        ).parent.data;
        if (parentNodeData.name.indexOf("应急专家") === 0) {
          res = "district";
        }
      }
      return res;
    }
  },
  watch: {
    tableData() {
      if (this.tableData.length < this.pageSize + this.pageNo - 1) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    },
    currentOnePoint() {
      this.$emit("setCount", 0);
      this.init();
    },
    exactBarQuery(data) {
      if (data.refresh) {
        this.$emit("setCount", 0);
        this.init();
      }
    },
    exactQuery(data) {
      if (data.refresh) {
        this.$emit("setCount", 0);
        this.init();
      }
    },
    search() {
      this.$emit("setCount", 0);
      this.init();
    }
  },
  methods: {
    init() {
      // 初始化配置
      this.pageNo = 1;
      this.count = 0;
      this.tableData = [];
      // 获取第一次数据
      this.initData();
      this.$nextTick(() => {
        setTimeout(() => {
          $("#" + this.myUuid + " .el-table__body-wrapper").off("scroll");
          $("#" + this.myUuid + " .el-table__body-wrapper").on("scroll", () => {
            var dom = $("#" + this.myUuid + " .el-table__body-wrapper")[0];
            if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight - 50) {
              if (this.flag) {
                this.flag = false;
                this.pageNo = this.pageNo + this.pageSize;
                this.initData();
              }
            }
          });
        }, 300);
      });
    },
    initData() {
      if (this.currentOnePoint && this.currentOnePoint.datasetname) {
        const showFileds = JSON.parse(
          JSON.stringify(this.currentOnePoint.showField)
        );
        if (this.userInfo.district && this.userInfo.district.length > 4) {
          const index1 = showFileds.indexOf("DISTRICT");
          if (index1 !== -1) {
            showFileds[index1] = "street";
          }
          const index2 = showFileds.indexOf("district");
          if (index2 !== -1) {
            showFileds[index2] = "street";
          }
        }
        let exactQueryKey = this.exactQuery.key;
        if (
          this.currentOnePoint.level - 0 === 3 &&
          this.currentOnePoint.name.lastIndexOf("专家") ===
            this.currentOnePoint.name.length - 2
        ) {
          const parentNodeData = this.$parent.$parent.$refs.tree.getTreeNode(
            this.currentOnePoint.key
          ).parent.data;
          if (parentNodeData.name.indexOf("应急专家") === 0) {
            showFileds[0] = "district";
            exactQueryKey = "district";
          }
        }
        likeStatistics(
          this.search,
          showFileds,
          exactQueryKey,
          this.exactQuery.value,
          this.exactBarQuery.key,
          this.exactBarQuery.value,
          this.pageNo,
          this.pageSize,
          this.currentOnePoint.datasetname.split(":")[1],
          this.userInfo.district,
          this.currentOnePoint.sql,
          showFileds[showFileds.length - 1]
        ).then(data => {
          this.$emit("closeLoading");
          if (!this.currentOnePoint) {
            return;
          }
          if (data) {
            const newData = data.slice(0, -1);
            this.count = data.slice(-1);
            this.$emit("setCount", this.count);
            if (newData.length) {
              for (var i = 0; i < newData.length; i++) {
                newData[i].index = this.pageNo + i;
              }
              // newData[0].latitude = ''
              if (this.pageNo === 1) {
                this.tableData = newData;
              } else {
                this.tableData = [...this.tableData, ...newData];
              }
            }
          } else {
            this.count = 0;
            this.$emit("setCount", this.count);
            this.tableData = [];
          }
        });
      } else {
        this.count = 0;
        this.$emit("setCount", this.count);
        this.$emit("closeLoading");
      }
    },
    rowClick(data) {
      data._mapPopField = this.currentOnePoint.mapPopField;
      data._mapPopName = this.currentOnePoint.mapPopName;
      this.$emit("rowClick", data);
    },
    clearCurrentTableRow() {
      this.$refs.singleTable.setCurrentRow();
    }
  }
};
</script>

<style scoped lang="less">
.loading {
  width: 100%;
  height: 0.2rem;
  background: url("images/loading.gif") no-repeat center;
}
.table-box {
  border: 0.01rem solid #0d95c7;
  height: 100%;
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
/deep/ .el-table,
.el-table__expanded-cell,
/deep/ .el-table th,
/deep/ .el-table tr {
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
  .no-wrap();
}
/deep/ .el-table tr:hover,
/deep/ .current-row {
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
.icon-wrapper {
  position: relative;
  padding-left: 0.1rem;
  img {
    position: absolute;
    top: 0;
    left: -0.1rem;
  }
}
</style>
