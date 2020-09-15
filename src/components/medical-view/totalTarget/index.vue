<!--
 * @Author: eds
 * @Date: 2020-09-15 09:07:19
 * @LastEditTime: 2020-09-15 09:11:50
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\totalTarget\index.vue
-->
<template>
  <div class="totalTarget">
    <component :is="target" />
  </div>
</template>

<script>
import medicalTarget from "./medicalTarget";
export default {
  data() {
    return {
      target: "medicalTarget",
    };
  },
  components: { medicalTarget },
};
</script>

<style lang="less">
@import url(./index.less);
</style>
