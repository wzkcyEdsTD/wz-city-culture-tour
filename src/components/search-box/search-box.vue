<template>
  <div class="search-wrapper">
    <div class="search-box">
      <i class="icon-search"></i>
      <input ref="query" @keyup="getValue" v-model="query" class="box" :placeholder="placeholder"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    getValue() {
      this.$emit('search', this.query)
    },
    clear() {
      this.query = ''
      this.getValue()
    }
  }
}
</script>

<style scoped lang="less">
  .search-wrapper {
    padding-bottom: 0.15rem;
  }
  .search-box {
    width: 100%;
    height: 0.32rem;
    background: transparent;
    display: flex;
    border: 0.01rem solid @color-border-blue;
    align-items: center;
    .icon-search {
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('images/icon-search');
      margin-left: 0.08rem;
    }
    .box {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      height: 100%;
      color: @color-border-blue;
      padding: 0.04rem;
      &::placeholder {
        color: @color-border-blue;
      }
    }
  }
</style>
