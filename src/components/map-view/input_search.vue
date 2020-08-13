<template>
  <div class="wrapper">
    <div class="search-body" :class="{collapse: !collapse1}">
      <el-select
        ref="elSelect"
        :popper-append-to-body="appendBody"
        class="global-search"
        v-model="value"
        v-show="isShow"
        filterable
        remote
        reserve-keyword
        placeholder="请输入资源名称"
        :remote-method="handleSearch"
        @change="handleChange"
        :loading="loading">
        <el-option
          v-for="item in data"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
      <img @click="showSearch" src="../../common/images/search.png" alt="">
      <transition
        enter-active-class="animated lightSpeedIn"
        leave-active-class="animated lightSpeedOut"
      >
        <!-- <el-select
          :popper-append-to-body="appendBody"
          class="global-search"
          v-model="value"
          v-show="isShow"
          filterable
          remote
          reserve-keyword
          placeholder="请输入资源名称"
          :remote-method="handleSearch"
          @change="handleChange"
          :loading="loading">
          <el-option
            v-for="item in data"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select> -->
      </transition>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapGetters } from 'vuex'

export default {
  props: {
    getBlurNames: {
      type: Array,
      defaule() {
        return []
      }
    }
  },
  data() {
    return {
      appendBody: false,
      loading: false,
      data: [],
      value: '',
      isShow: false,
      text: '',
      inputText: '',
      isFirstSearch: true
    }
  },
  computed: {
    ...mapGetters('map', {
      collapse1: 'collapse1'
    })
  },
  watch: {
    // getBlurNames(getBlurNames) {
    //   this.data = []
    //   if (!getBlurNames || getBlurNames.length === 0) {
    //     return
    //   }
    //   var __this = this
    //   var isPushData = true
    //   for (var i = 0; i < getBlurNames.length; i++) {
    //     var blurNames = getBlurNames[i].blurNames
    //     if (!blurNames || blurNames.length === 0) {
    //       continue
    //     }

    //     for (var j = 0; j < blurNames.length; j++) {
    //       var eachJson = {
    //         value: blurNames[j].value[0] + ',' + blurNames[j].value[1],
    //         text: blurNames[j].name,
    //         streetName: blurNames[j].streetName,
    //         address: blurNames[j].address,
    //         mapPopName: getBlurNames[i].mapPopName,
    //         detail: blurNames[j].detail
    //       }
    //       __this.data.forEach(item => {
    //         if (eachJson.value === item.value) {
    //           isPushData = false
    //         }
    //       })
    //       if (isPushData) {
    //         __this.data.push(eachJson)
    //       }
    //     }
    //   }
    // }
    getBlurNames(getBlurNames) {
      if (this.isFirstSearch === true) {
          this.data = [];
      }
      if (!getBlurNames || getBlurNames.length === 0) {
        return;
      }
      for (var i = 0; i < getBlurNames.length; i++) {
        var isPushData = true;
        var eachJson = {
          value: getBlurNames[i].TABLENAME + ',' + getBlurNames[i].SMID,
          text: getBlurNames[i].NAME
        };
        this.data.forEach(item => {
          if (eachJson.value === item.value) {
            isPushData = false
          }
        });
        if (isPushData) {
          this.data.push(eachJson);
        }
      }
      this.loading = false
    }
  },
  mounted() {
    const me = this
    const input = this.$refs.elSelect.$el
    input.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      me.$nextTick(() => {
        const el = input.children[0].children[0]
        el.placeholder = '请输入资源名称'
        me.value = ''
        me.data = []
      })
    }
    this.$nextTick(() => {
      setTimeout(() => {
        $('.global-search .el-select-dropdown__wrap').off('scroll')
        $('.global-search .el-select-dropdown__wrap').on('scroll', () => {
          var dom = $('.global-search .el-select-dropdown__wrap')[0]
          if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
            if (me.data.length < 50) {
              return
            }
            me.isFirstSearch = false
            me.$emit('searchFeatureNames', me.inputText)
          }
        })
      }, 300)
    })
  },
  methods: {
    // 输入文字，自动查询
    handleSearch(value) {
      if (value.trim() === '') {
        return;
      }
      this.loading = true
      this.inputText = value
      this.$emit('searchFeatureNames', value)
      this.isFirstSearch = true
    },
    showSearch() {
      this.isShow = !this.isShow
    },
    handleChange(value) {
      this.value = value
      for (var i = 0; i < this.data.length; i++) {
        if (this.value === this.data[i].value) {
          this.$emit('chooseAddress', this.data[i])
          break
        }
      }
    }
  }
}
/* eslint-disable */
</script>

<style scoped lang="less">
  .el-select {
    display: inline;
  }
  .wrapper.collapse .search-body {
    left: 3.4rem;
  }
  .wrapper.collapse .search-body.collapse {
    left: 2.5rem;
  }
  .search-body {
    // width: 0.5rem;
    height: 0.3rem;
    position: absolute;
    left:5.9rem;
    top: 0.555rem;
    z-index: 1;
    margin: 0.04rem;
    transition: all 0.3s linear;
    border: 1px solid #5ab0e5;
    color: #00192E;
    border-radius: 6px;
    outline: none;
    background: #03315a;
    display: flex;
    align-items: center;
    padding: 0 0.1rem;
    // padding: 10px;
    img {
      // border: 1px solid @color-border-blue;
      // background: #5ab0e5;
      cursor: pointer;
    }
  }
  .global-search {
    width: 1.3rem;
    // position: absolute;
    // left: 0.5rem;
    z-index: 1;
    height: 0.28rem;
    // transition: all 0.3s linear;
    // border: 1px solid #5ab0e5;
    color: #00192E;
    border-radius: 0.15rem;
    outline: none;
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 10px;
    /*padding-left: 0;*/
    /*margin-left: 10px;*/
  }
  /deep/ .global-search {
    .el-select-dropdown {
      background: #43bafe;
      border: none;
    }
    .el-select-dropdown__empty {
      color: #fff;
    }
    .el-popper[x-placement^=bottom] .popper__arrow {
      border-bottom-color: #43bafe;
      &:after {
        border-bottom-color: #43bafe;
      }
    }
    .el-select-dropdown__item {
      color: #fff;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
      background-color: rgba(0, 122, 192, 0.6)
    }
    .el-input__inner {
      background: transparent;
      border: none;
      color: #fff;
      height: 0.28rem;
      &::placeholder {
        color: #43bafe;
      }
    }
    .el-input {
      position: relative;
      font-size: 0.14rem;
    }
    .el-input__icon {
      line-height: 0.3rem;
      color: #43bafe;
    }
  }
  /deep/ .el-select-dropdown {
    left: auto !important;
  }
</style>
