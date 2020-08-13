import { mapGetters, mapActions } from 'vuex'

export const monitorTypeMixin = {
  data() {
    return {
      dotIndex: 0,
      timer: null
    }
  },
  computed: {
    ...mapGetters('warning', [
      'currentMonitorType',
      'monitorType',
      'clearAllLayers',
      'currentPoints'
    ])
    // ...mapState('warning', ['currentPoints'])
  },
  mounted() {
    if (this.currentPoints.indexOf(this.point) > -1) {
      if (this.monitorType.length) {
        this.changeDot()
        this.DeleteCurrentPoints(this.point)
        clearInterval(this.timer)
      } else {
        setTimeout(() => {}, 500)
      }
    }
  },
  watch: {
    currentMonitorType() {
      if (this.currentMonitorType.from !== this.point) {
        if (this.currentMonitorType.alias === this.point) {
          if (this.currentMonitorType.checked) {
            this.dotIndex = 1
          } else {
            this.dotIndex = 0
          }
        }
      }
    },
    monitorType(val) {
      // 选中状态
      if (this.currentPoints.indexOf(this.point) > -1) {
        if (this.monitorType.length) {
          this.changeDot()
          this.DeleteCurrentPoints(this.point)
          clearInterval(this.timer)
        }
      }
    },
    clearAllLayers() {
      if (this.clearAllLayers.value) {
        if (this.dotIndex instanceof Array) {
          const arr = [...this.dotIndex]
          arr.forEach((_, index) => {
            arr[index] = 0
          })
          this.dotIndex = arr
        } else {
          this.dotIndex = 0
        }
      }
    }
  },
  methods: {
    updatePoints() {
      if (this.monitorType.length) {
        this.changeDot()
        this.DeleteCurrentPoints(this.point)
        clearInterval(this.timer)
      } else {
        setTimeout(() => {
          this.updatePoints()
        }, 500)
      }
    },
    changeDot() {
      if (this.monitorType.length) {
        this.dotIndex = (this.dotIndex + 1) % 2
        let obj = {}
        const list = []
        var findOut = false
        for (let i = 0; i < this.monitorType.length; i++) {
          if (this.monitorType[i].alias === this.point) {
            obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            // i = this.monitorType.length
            findOut = true
          }
          if (this.monitorType[i].alias.indexOf(this.point) >= 0) {
            const obj = JSON.parse(JSON.stringify(this.monitorType[i]))
            obj.checked = Boolean(this.dotIndex)
            obj.from = this.point
            list.push(obj)
          }
          if (findOut === true) {
            break
          }
        }
        obj.checked = Boolean(this.dotIndex)
        obj.from = this.point
        if (this.point === 'liangkeyiweijiance') {
          this.SetCurrentMonitorTypeArr(list)
        } else {
          this.SetCurrentMonitorType(obj)
        }
      }
    },
    ...mapActions('warning', [
      'SetCurrentMonitorType',
      'SetCurrentMonitorTypeArr',
      'SetCurrentPoints',
      'DeleteCurrentPoints'
    ])
  }
}
