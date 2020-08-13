<template>
  <div>
    <div>
      <i class="close" @click="close"></i>
      <div class="title">要素个数</div>
      <div class="select-wrapper flex">
        <!--        <el-input-->
        <!--          @input="changeInput"-->
        <!--          type="text"-->
        <!--          placeholder="请输入个数"-->
        <!--          v-model="inputValue">-->
        <!--          <template slot="append">个</template>-->
        <!--        </el-input>-->
        <el-input-number
          class="flex-1"
          v-model="inputValue"
          :step="1"
          :min="1"
          :max="9999"
          controls-position="right"
          step-strictly></el-input-number>
        <span class="company">个</span>
        <el-button class="submit" type="primary" plain @click="goAnalyse">就近分析</el-button>
      </div>
    </div>
    <div class="tree-wrapper flex-1">
      <AroundTree
        :data="treeData"
        @itemClick="itemClick"
        @checkedItem="checkedItem"></AroundTree>
    </div>
    <div class="table-wrapper" v-show="isShowTable">
      <i class="arrow" :style="{'top':top+'px'}"></i>
      <i class="close" @click="closeTable"></i>
      <AroundTable :data="spaceTableData" @rowClick="rowClick"></AroundTable>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
import AroundTree from './around-tree'
import AroundTable from './around-table'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      data: {
        count: 3,
        mapData: {
          features: []
        }
      },
      inputValue: 3,
      treeData: [],
      top: 0, // 箭头高度
      isShowTable: false,
      spaceTableData: {},
      allData: []
    }
  },
  watch: {
    data(data) {
      this.inputValue = this.data.count
      this.allData = [...this.allData, ...data.mapData.features]
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
    }
  },
  methods: {
    init(centerCoordinates) {
      this.data = {
        count: 3,
        mapData: {
          features: []
        }
      }
      this.inputValue = 3
      this.treeData = []
      this.top = 0
      this.isShowTable = false
      this.spaceTableData = {}
      this.allData = []
      this.goAnalyse()
    },
    goAnalyse() {
      const num = Math.floor(this.inputValue)
      // 需要判断num是否是数字
      // 调用地图查询
      this.allData = []
      let centerCoordinates = []
      if (this.$parent.$parent.onePoint.longitude && this.$parent.$parent.onePoint.latitude) {
        centerCoordinates = [this.$parent.$parent.onePoint.longitude - 0, this.$parent.$parent.onePoint.latitude - 0]
      }
      this.$parent.$parent.$refs.baseMap.queryNearbyBase(centerCoordinates, num)
      // setTimeout(() => {
      //   this.data = {
      //     "count": 3,
      //     "mapData": {
      //       "type": "FeatureCollection",
      //       "features":
      //         [
      //           {
      //             "type": "Feature",
      //             "properties": {
      //               "SMID": "52",
      //               "SMUSERID": "0",
      //               "SMGEOMETRY": "[B@29f45ec0",
      //               "NAME": "乐清市疾病预防控制中心",
      //               "ADDRESS": "城东街道晨曦路111号",
      //               "PHONE": "61886807",
      //               "LONGITUDE": "120.97608973300009",
      //               "LATITUDE": "28.120552202000056",
      //               "AREA": "",
      //               "CHARGE_MAN": "周勇",
      //               "CHARGE_MAN_TEL": "15858588777",
      //               "GUID": "",
      //               "TYPE": "疾控中心2",
      //               "BID": "YQJKZX001",
      //               "RELATE_TABLE": "JZJZNL_YLJH_JKZX",
      //               "DATA_DISPLAY": "乐清市,市局",
      //               "CITY": "温州市",
      //               "CITY_CODE": "3303",
      //               "DISTRICT": "乐清市",
      //               "DISTRICT_CODE": "330382",
      //               "STREET": "城东街道",
      //               "STREET_CODE": "330382001",
      //               "VILLAGE": "",
      //               "VILLAGE_CODE": "",
      //               "DEPTNAME": "",
      //               "DEPTID": "",
      //               "LONGITUDE_LATITUDE": "",
      //               "DATATYPE": "疾控中心2",
      //               "TABLE_NAME": "JZJZNL_YLJH_JKZX",
      //               "ROOTNAME": "减灾救灾资源2",
      //               "CREATED_TIME": "",
      //               "UPDATED_TIME": "",
      //               "CHECK_USER": "是",
      //               "DEALER": "xys",
      //               "SHARED": "",
      //               "distanceFromCenter": 11463.501149494636
      //             },
      //             "geometry": {
      //               "type": "Point",
      //               "coordinates": [120.9760897330001, 28.120552202000056]
      //             },
      //             "id": 52
      //           },
      //           {
      //             "type": "Feature",
      //             "properties": {
      //               "SMID": "45",
      //               "SMUSERID": "0",
      //               "SMGEOMETRY": " [B@5b9eac30",
      //               "NAME": "永嘉县疾病预防控制中心",
      //               "ADDRESS": "永嘉县北城街道环城西路779号",
      //               "PHONE": "",
      //               "LONGITUDE": "120.683984272",
      //               "LATITUDE": "28.158445349000001",
      //               "AREA": "",
      //               "CHARGE_MAN": "",
      //               "CHARGE_MAN_TEL": "",
      //               "GUID": "",
      //               "TYPE": "疾控中心",
      //               "BID": "YJJKZX001",
      //               "RELATE_TABLE": "JZJZNL_YLJH_YLWZ,JZJ",
      //               "DATA_DISPLAY": "永嘉县,市局",
      //               "CITY": "温州市",
      //               "CITY_CODE": "3303",
      //               "DISTRICT": "永嘉县",
      //               "DISTRICT_CODE": "330324",
      //               "STREET": "北城街道",
      //               "STREET_CODE": "330324002",
      //               "VILLAGE": "",
      //               "VILLAGE_CODE": "",
      //               "DEPTNAME": "",
      //               "DEPTID": "",
      //               "LONGITUDE_LATITUDE": "",
      //               "DATATYPE": "疾控中心",
      //               "TABLE_NAME": "JZJZNL_YLJH_JKZX",
      //               "ROOTNAME": "减灾救灾资源",
      //               "CREATED_TIME": "",
      //               "UPDATED_TIME": "",
      //               "CHECK_USER": "是",
      //               "DEALER": "xys",
      //               "SHARED": "",
      //               "distanceFromCenter": 17486.592967916633
      //             },
      //             "geometry": {
      //               "type ": "Point",
      //               "coordinates": [120.68398427200009, 28.158445349000033]
      //             },
      //             "id": 45
      //           },
      //           {
      //             "type": "Feature",
      //             "properties": {
      //               "SMID": "49",
      //               "SMUSERID": "0",
      //               "SMGEOMETRY": " [B@1e6b069",
      //               "NAME": "龙湾区疾病预防控制中心",
      //               "ADDRESS": "龙湾区永中街道永青路126号",
      //               "PHONE": "56581177",
      //               "LONGITUDE": "120.80607295400011",
      //               "LATITUDE": "27.910636539000052",
      //               "AREA": "4000㎡ ",
      //               "CHARGE_MAN": "郑力",
      //               "CHARGE_MAN_TEL": "13857720595",
      //               "GUID": "",
      //               "TYPE": "疾控中心",
      //               "BID": "LWJKZX001",
      //               "RELATE_TABLE": "JZJZNL_YLJH_JKZX",
      //               "DATA_DISPLAY": "龙湾区,市局",
      //               "CITY": "温州市",
      //               "CITY_CODE": "3303",
      //               "DISTRICT": "龙湾区",
      //               "DISTRICT_CODE": "330303",
      //               "STREET": "永中街道",
      //               "STREET_CODE": "330303001",
      //               "VILLAGE": "",
      //               "VILLAGE_CODE": "",
      //               "DEPTNAME": "",
      //               "DEPTID": "",
      //               "LONGITUDE_LATITUDE": "",
      //               "DATATYPE": "疾控中心",
      //               "TABLE_NAME": "JZJZNL_YLJH_JKZX",
      //               "ROOTNAME": "减灾救灾资源",
      //               "CREATED_TIME": "",
      //               "UPDATED_TIME": "",
      //               "CHECK_USER": "是",
      //               "DEALER": "xys",
      //               "SHARED": "",
      //               "distanceFromCenter": 25517.692146007743
      //             }, "geometry": {
      //               "type": "Point",
      //               "coordinates": [120.80607295400011, 27.910636539000052]
      //             },
      //             "id": 49
      //           }
      //         ]
      //     }
      //   }
      // })
    },
    close() {
      this.closeTable()
      this.inputValue = 3
      this.allData = []
      this.data = {
        count: 3,
        mapData: {
          features: []
        }
      }
      this.$emit('close')
      // this.$parent.$parent.$refs.baseMap.closeQueryNearBase()
    },
    closeTable() {
      this.isShowTable = false
    },
    showTable() {
      this.isShowTable = true
    },
    ...mapActions('map', [
      'SetCollapse2'
    ]),
    itemClick(data) {
      this.top = data.height
      this.spaceTableData = data.data
      this.showTable()
    },
    checkedItem() {
    },
    // 具体某条信息被点击后
    rowClick(data) {
      this.$emit('rowClick', data)
    }
  },
  components: {
    AroundTree,
    AroundTable
  }
}
</script>

<style scoped lang="less">
  .table-wrapper {
    width: 3.6rem;
    height: 3rem;
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
  .close {
    position: absolute;
    right: 0.2rem;
    top: 0.17rem;
    width: 0.2rem;
    height: 0.2rem;
    display: block;
    .bg-image('../../../images/zoom-in');
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    cursor: pointer;
    &:hover {
      transform: rotate(45deg);
    }
  }
  .title {
    height: 0.35rem;
    line-height: 0.5rem;
    color: #fff;
    font-size: 0.18rem;
    padding: 0 0.1rem;
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
  /deep/ .el-input-number {
    line-height: 0.3rem;
    > span {
      height: 0.14rem !important;
      line-height: 0 !important;
    }
  }
  .company {
    color: #fff;
    line-height: 0.3rem;
    padding: 0 0.1rem;
  }
</style>

