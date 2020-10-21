<template>
  <div id="app">
    <loading v-show="isLoading"></loading>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Loading from "components/loading/loading";
import { getUserInfo } from "./api/public/public";
import { mapGetters, mapActions, mapState } from "vuex";
import { getRoleCategory } from "api/map/map";
import category from "mock/category";
export default {
  name: "App",
  components: {
    // MHeader,
    Loading,
  },
  data() {
    return {
      nameList: [],
      // onMessage: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    ...mapState({
      isLoading: "isLoading",
    }),
  },
  created() {
    // 监听父窗口事件
    window.addEventListener(
      "message",
      (e) => {
        let data = e.data;
        if (!data.layer) return;
        console.log("message", e);
        window._POST_MESSAGE_ = data.layer;
        this.$bus.$emit("source-message");
      },
      false
    );
  },
  mounted() {
    // getUserInfo().then(data => {
    //   if (data.districtName !== this.userInfo.districtName) {
    //     this.$router.push("/map");
    //   }
    //   this.SetUserInfo(data);
    //   document.getElementsByTagName("title")[0].innerText =
    //     "温州设计集团大数据可视化分析基础平台";
    // });
    // getRoleCategory().then(res => {
    //   // this.getName(category);
    //   this.getName(res);
    //   this.SetNameList(this.nameList);
    // });
  },
  methods: {
    ...mapActions(["SetUserInfo", "changeLoad", "SetResize"]),
    ...mapActions("map", ["SetNameList"]),
  },
};
</script>

<style lang="less">
@import "common/css/reset";
@import "common/css/rem";
@import "common/css/flex";
@import "common/css/transition";
* {
  box-sizing: border-box;
  font-family: "Microsoft YaHei";
  user-select: none;
}
body {
  font-size: 14px;
}
html,
body {
  width: 100%;
  height: 100%;
}
/*body{*/
/*  width:5760px;*/
/*  height: 1620px;*/
/*  overflow: auto*/
/*}*/
#app {
  width: 100%;
  height: 100%;
  // .bg-image("common/images/bg");
}
#app > .content {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 9;
  > * {
    width: 100%;
    height: 100%;
  }
}
.water-detail {
  border: 1px solid #4099ff;
  /deep/.el-picker-panel__body-wrapper {
    background-color: #0d182c;
  }
  /deep/.el-picker-panel__footer {
    background-color: #0d182c;
    border-top: 1px solid #40c7ff;
  }
  /deep/.el-picker-panel__sidebar {
    background-color: #0d182c;
    border-right: 1px solid #40c7ff;
  }
  /deep/.el-date-range-picker__content.is-left {
    border-right: 1px solid #40c7ff;
  }
  /deep/.el-date-range-picker__time-header {
    border-bottom: 1px solid #40c7ff;
  }
  /deep/.el-date-table th {
    border-bottom: solid 1px #40c7ff;
    color: #fff;
  }
  /deep/.el-picker-panel__shortcut {
    color: #ffffff;
  }
  /deep/.el-input--small .el-input__inner {
    background-color: #0c2146;
    color: #ffffff;
    border: 1px solid #409eff;
  }
  /deep/.el-date-range-picker .el-picker-panel__content {
    color: #ffffff;
  }
  /deep/.el-date-table td.in-range div,
  .el-date-table td.in-range div:hover,
  .el-date-table.is-week-mode .el-date-table__row.current div,
  .el-date-table.is-week-mode .el-date-table__row:hover div {
    background-color: #000;
  }
  /deep/.el-button.is-plain:focus,
  .el-button.is-plain:hover {
    background-color: #0088eb;
    color: #fff;
  }
  /deep/.el-button {
    background-color: #159bfd;
    color: #fff;
    border: none;
  }
  /deep/.el-button--text {
    background-color: rgba(0, 0, 0, 0);
    color: #d3d3d3;
  }
  /deep/.popper__arrow::after {
    border-bottom-color: rgba(0, 0, 0, 0);
  }
  /deep/.el-popper .popper__arrow {
    border-bottom-color: #40c7ff;
  }
  /deep/.el-date-range-picker__content .el-date-range-picker__header div {
    color: #fff;
  }
  /deep/.available {
    color: #fff;
  }
  /deep/.el-button.is-disabled.is-plain {
    background-color: #159bfd;
    color: #ffffff;
  }
  /deep/.el-time-panel {
    background-color: #000;
    border: none;
    box-shadow: #159bfd 0px 0px 18px inset;
    border-radius: 6px;
    padding-top: 10px;
  }
  /deep/.el-time-spinner__item {
    color: #fff;
  }
  /deep/.el-time-spinner__item.active:not(.disabled) {
    color: #159bfd;
  }
  /deep/.el-time-panel__footer {
    border-top: none;
  }
  /deep/.el-time-panel__btn {
    color: #d7d7d7;
  }
  /deep/.el-time-panel__content::after,
  .el-time-panel__content::before {
    border-top: 1px solid #ababab;
    border-bottom: 1px solid #ababab;
  }
  /deep/.el-time-spinner__item:hover:not(.disabled):not(.active) {
    background: rgba(0, 0, 0, 0);
    color: #159bfd;
  }
}
// transform css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
