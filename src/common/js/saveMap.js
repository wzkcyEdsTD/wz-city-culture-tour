import { getTeamStatisticsData, getShelterAddressMainByUser, getEquipmentMainMap } from 'api/save/save'
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      list: ['应急队伍', '应急关键设备', '应急避难场所'], // 列表数据
      listIndex: 0, // 列表下标
      total: 0, // 总数
      dataList: [], // 各数据列表
      totalList: [],
      isEnter: true,
      scroll: true,
      timeData: [],
      timeDataIndex: 0
    }
  },
  created() {
    this.update()
  },
  computed: {
    pointData() {
      return this.bottomData.typeViews || []
    },
    bottomData() {
      return this.timeData[this.timeDataIndex] || {
        typeList: [],
        typeTotalCount: 0,
        name: ''
      }
    },
    ...mapGetters([
      'userInfo'
    ]),
    ...mapState({
      'stepName': state => state.stateM.stepName
    })
  },
  watch: {
    stepName(val) {
      this.list.forEach((v, k) => {
        if (val.name === v) {
          this.listChange(k)
        }
      })
    }
  },
  methods: {
    // 设置左侧头部列表
    listChange(index) {
      this.listIndex = index
      this.initData(index)
    },
    // 设置时间轴下标
    changeTimeDataIndex(index) {
      this.timeDataIndex = index
    },
    // 更新'安全风险源', '一级风险源', '本年地质灾害'的数据
    update() {
      Promise.all([getTeamStatisticsData(), getEquipmentMainMap(), getShelterAddressMainByUser()]).then(res => {
        // console.log(res[0].list)
        // 第一个接口
        this.dataList[0] = res[0].typeViews
        this.totalList[0] = res[0].totalCount
        // 第二个接口
        this.dataList[1] = res[1].list.map(val => {
          val.name = val.type
          val.typeViews = val.list
          return val
        }).slice(0, 9)
        this.totalList[1] = res[1].total
        // 第三个接口
        this.dataList[2] = res[2].shelter.categoryViews
        this.dataList[2][0].typeViews = res[2].shelter.categoryViews
        this.totalList[2] = res[2].shelter.totalCount
        this.listChange(0)
      })
    },
    // 轮播状态改变
    mouseChange(boolean) {
      if (boolean) {
        this.scroll = false
      } else {
        this.scroll = true
      }
      this.isEnter = boolean
    },
    // 走接口获取数据
    initData(index) {
      switch (index) {
        case 0:
          this.timeData = this.dataList[0] || []
          this.timeDataIndex = 0
          this.total = this.totalList[0]
          break
        case 1:
          this.timeData = this.dataList[1]
          this.timeDataIndex = 0
          this.total = this.totalList[1]
          break
        case 2:
          this.timeData = this.dataList[2]
          this.timeDataIndex = 0
          this.total = this.totalList[2]
          // console.log(this.chartList)
          break
      }
    }
  },
  mounted() {
  }
}
