<template>
  <div class="target-wrapper">
    <span class="header">基础信息</span>
    <ul class="content">
      <li class="item" v-for="(item,i) in [0,1,2,3]" :key="i">
        <img class="icon hospital" src="/static/images/index/unknowns.png" />
        <div class="right">
          <div class="title">
            unknown
            <span class="small">(人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当日</span>
          </div>
          <div class="number">-</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "basicIndex",
};
</script>
