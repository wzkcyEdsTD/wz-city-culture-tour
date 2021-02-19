<!--
 * @Author: eds
 * @Date: 2020-07-07 10:57:45
 * @LastEditTime: 2020-09-15 11:07:30
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\treeTool\searchBox.vue
-->
<template>
  <div class="search-box" v-show="searchBoxVisible">
    <div class="header">
      <p :class="{ active: searchBoxSource }" @click="searchSwitch(true)">资源检索</p>
      <p>/</p>
      <p :class="{ active: !searchBoxSource }" @click="searchSwitch(false)">事件检索</p>
    </div>
    <SearchSource v-show="searchBoxSource" />
    <SearchEvent v-show="!searchBoxSource" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SearchSource from "./SearchSource";
import SearchEvent from "./SearchEvent";
export default {
  name: "SearchBox",
  computed: {
    ...mapGetters("map", ["searchBoxVisible", "searchBoxSource"]),
  },
  components: { SearchSource, SearchEvent },
  methods: {
    ...mapActions("map", ["SetSearchBoxSource"]),
    /**
     * 选择检索类型
     * @param {boolean} boolean
     */
    searchSwitch(boolean) {
      this.SetSearchBoxSource(boolean);
    },
  },
};
</script>

<style lang="less">
@import url("./SearchBox.less");
</style>
