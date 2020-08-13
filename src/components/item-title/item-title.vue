<template>
  <div class="item-title flex">
    <i :style="bgColor"></i>
    <span class="text">{{title}}</span>
    <div class="search-wrapper flex-1" v-if="placeholder">
      <div class="search-box-move">
        <div class="search-box" :class="{'active':(isShow || isShowSearch)}">
          <input @blur="blur" ref="query" v-model="query" class="box" :placeholder="placeholder"/>
          <div class="search-icon-box" @click="showSearch"><i class="icon-search"></i></div>
        </div>
        <transition name="clear">
          <i class="close" @click="close" v-show="query.length>0 && (isShow||isShowSearch)"></i>
        </transition>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'

export default {
  name: 'ItemTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#43BAFE'
    },
    placeholder: {
      type: String,
      default: ''
    },
    isShowSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      query: '',
      isShow: false
    }
  },
  computed: {
    bgColor() {
      return { background: this.color }
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('search', this.query)
    }, 200))
  },
  methods: {
    blur() {
      if (!this.query) {
        this.isShow = false
      }
    },
    showSearch() {
      if (this.isShowSearch) {
        return
      }
      this.isShow = !this.isShow
      if (this.isShow) {
        this.$refs.query.focus()
      }
    },
    clear() {
      this.query = ''
    },
    close() {
      this.clear()
      this.$refs.query.focus()
    }
  }
}
</script>

<style scoped lang="less">
  .item-title {
    height: 0.34rem;
    line-height: 0.34rem;
    color: @color-text;
    margin-bottom: 0.1rem;
    position: relative;
    .bg-image('images/bg');
    > i {
      width: 0.06rem;
      height: @font-size-medium;
      float: left;
      margin: 0.1rem @font-size-small-s 0;
    }
    .text {
      padding-right: 0.2rem;
      font-size: 0.20rem;
    }
  }
  .search-wrapper {
    position: relative;
    margin-top: 0.04rem;
    .search-box-move {
      width: 100%;
      height: 100%;
      position: relative;
    }
  }
  .search-box {
    margin-top: 0.01rem;
    width: 0.26rem;
    height: 0.26rem;
    background: transparent;
    border: 0.01rem solid @color-border-blue;
    border-radius: 0.18rem;
    align-items: center;
    display: block;
    float: right;
    transition: all 0.3s linear;
    &.active {
      width: 100%;
      .box {
        padding-right: 0.3rem;
      }
    }
    .search-icon-box {
      width: 0.26rem;
      height: 0.26rem;
      cursor: pointer;
      float: right;
      .icon-search {
        width: 0.16rem;
        height: 0.16rem;
        display: block;
        .bg-image('images/icon-search');
        margin: 0.05rem;
      }
    }
    .box {
      float: right;
      width: calc(100% - 0.26rem);
      background: transparent;
      border: none;
      outline: none;
      height: 100%;
      font-size: 0.14rem;
      color: @color-border-blue;
      transition: all 0.3s linear;
      &::placeholder {
        color: @color-border-blue;
      }
    }
  }
  .close {
    color: #ffffff;
    font-size: 0.14rem;
    position: absolute;
    top: 0.07rem;
    right: 0.07rem;
    cursor: pointer;
    width: 0.16rem;
    height: 0.16rem;
    display: block;
    .bg-image('./images/close');
    transform: rotate(-45deg);
    transition: all 0.1s linear;
    &:hover {
      transform: rotate(45deg);
    }
  }
  .clear-enter-active, .clear-leave-active {
    transition: opacity .5s;
  }
  .clear-enter, .clear-leave-to {
    opacity: 0;
  }
  input {
    padding: 0;
  }
</style>
