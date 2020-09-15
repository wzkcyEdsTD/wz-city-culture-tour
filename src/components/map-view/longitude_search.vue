<!--
 * @Author: eds
 * @Date: 2020-08-11 20:39:44
 * @LastEditTime: 2020-09-15 11:02:00
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\map-view\longitude_search.vue
-->
<template>
  <div class="wrapper" :class="{collapse: collapse2}" @click.stop>
    <div class="search-body">
      <input
        @click.stop
        v-model="query"
        @keyup.enter="search"
        ref="input"
        class="input"
        type="text"
        placeholder="经纬度用英文逗号隔开">
      <img @click.stop="search" src="/static/images/common/loglat_search.png" alt="">
    </div>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters('map', [
      'collapse2'
    ])
  },
  watch: {},
  mounted() {
  },
  methods: {
    search() {
      this.$parent.$parent.$refs.baseMap.longitudeSearch(this.query)
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 0.3rem;
    position: relative;
    transition: all 0.3s linear;
    border: 1px solid #5ab0e5;
    color: #00192E;
    border-radius: 6px;
    background: #03315a;
    padding: 0 0.1rem;
    .search-body {
      height: 100%;
      display: flex;
      align-items: center;
      > img {
        cursor: pointer;
      }
      > input {
        outline: none;
        background: transparent;
        border: none;
        padding-right: 0.05rem;
        color: #ffff;
        &::placeholder {
          color: #43bafe;
        }
      }
    }
  }
</style>
