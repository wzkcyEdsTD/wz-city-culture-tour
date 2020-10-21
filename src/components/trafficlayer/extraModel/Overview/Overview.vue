<template>
  <div>
    <OverviewNOW ref="overviewNow" v-if="forceTime == 'now'" />
    <OverviewPASS ref="overviewPass" v-if="forceTime == 'pass'" />
  </div>
</template>

<script>
import OverviewNOW from "./OverviewNOW";
import OverviewPASS from "./OverviewPASS";
import { mapGetters } from "vuex";

export default {
  name: "Overview",
  computed: {
    ...mapGetters("map", ["forceTime"]),
  },
  components: { OverviewNOW, OverviewPASS },
};
</script>

<style>
</style>