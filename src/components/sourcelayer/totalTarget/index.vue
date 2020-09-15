<!--
 * @Author: eds
 * @Date: 2020-09-15 09:07:19
 * @LastEditTime: 2020-09-15 11:04:10
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\totalTarget\index.vue
-->
<template>
  <div class="totalTarget">
    <component :is="target" />
    <scene-switch />
  </div>
</template>

<script>
import SceneSwitch from "../commonFrame/SceneSwitch/SceneSwitch";
import medicalTarget from "./medicalTarget";
export default {
  data() {
    return {
      target: "medicalTarget",
    };
  },
  components: { medicalTarget, SceneSwitch },
};
</script>

<style lang="less">
@import url(./index.less);
</style>
