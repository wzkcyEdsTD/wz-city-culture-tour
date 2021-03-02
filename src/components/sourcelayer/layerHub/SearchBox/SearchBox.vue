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
      <p :class="{ active: doSource }" @click="searchSwitch(1)">资源</p>
      <p>/</p>
      <p :class="{ active: doEvent }" @click="searchSwitch(2)">事件</p>
      <p>/</p>
      <p :class="{ active: doAdress }" @click="searchSwitch(3)">地名地址</p>
    </div>
    <SearchSource v-show="doSource" />
    <SearchEvent v-show="doEvent" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SearchSource from "./SearchSource";
import SearchEvent from "./SearchEvent";
export default {
  name: "SearchBox",
  computed: {
    ...mapGetters("map", ["searchBoxVisible", "searchBoxModel"]),
    doSource() {
      return this.searchBoxModel == 1;
    },
    doEvent() {
      return this.searchBoxModel == 2;
    },
    doAdress() {
      return this.searchBoxModel == 3;
    },
  },
  components: { SearchSource, SearchEvent },
  methods: {
    ...mapActions("map", ["SetSearchBoxModel"]),
    /**
     * 选择检索类型
     * @param {number} type
     */
    searchSwitch(type) {
      this.SetSearchBoxModel(type);
    },
  },
};
</script>

<style lang="less">
@import url("./SearchBox.less");
</style>
