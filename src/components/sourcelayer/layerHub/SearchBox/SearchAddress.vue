<template>
  <div class="search-main search-source">
    <div class="searchHeader">
      <el-input
        v-model="searchText"
        class="searchFilterInput"
        placeholder="地名地址查询关键字"
        size="small"
        @keyup.enter.native="doSearchAddress"
      />
      <div class="button-container">
        <div class="button-item">
          <i class="icon-common icon-clear" @click="searchClear"></i>
        </div>
        <div class="button-item">
          <i class="icon-common icon-search" @click="doSearchAddress"></i>
        </div>
      </div>
    </div>
    <div class="result-wrapper">
      <ul class="result-list">
        <li
          class="result-item"
          :class="{
            checked: searchChecked == i,
          }"
          v-for="(item, i) in SearchList"
          :key="`sitem-${i}`"
          @click="checkedOne(item, i)"
        >
          <p class="name" :title="item.name">{{ ++i }}. {{ item.name }}</p>
          <input type="checkbox" :checked="searchChecked == i" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchAddress",
  data() {
    return {
      searchText: "",
      SearchList: [],
      searchChecked: undefined,
    };
  },
  mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {},
    doSearchAddress() {},
    searchClear() {},
  },
};
</script>
