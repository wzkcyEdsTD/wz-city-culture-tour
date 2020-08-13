<template>
  <transition
    enter-active-class="animated lightSpeedIn"
    leave-active-class="animated bounceOutDown"
  >
    <div class="legend" :class="{isShow:isShow,collapse:collapse2, isSmall: isSmall}">
      <div v-show="!isSmall" class="panel-body text-center">
        <ul id="legendTip">
          <li v-for="(item, index) in legendMsg2.legendAry" :key='index'>
            <div class="new_01">{{item.des}}：</div>
            <div class="new_01"><img class="tu" :src="item.icon"></div>
          </li>
        </ul>
      </div>
      <i v-show="!isSmall" class="close" @click="small" title="缩小"></i>
      <i v-show="isSmall" class="small" @click="small" title="展开"></i>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Legend',
  props: {
    legendMsg2: {
      type: Object,
      defaule() {
        return {
          legendAry: []
        }
      }
    }
  },
  data() {
    return {
      isShow: false,
      isSmall: false
    }
  },
  computed: {
    ...mapGetters('map', [
      'collapse2',
      'treeCheckedList'
    ])
  },
  methods: {
    show() {
      this.isShow = true
      this.isSmall = false
      // this.SetLegendShow(this.isShow)
    },
    hide() {
      this.isShow = false
      // this.SetLegendShow(this.isShow)
    },
    small() {
      this.isSmall = !this.isSmall
    },
    ...mapActions('map', [
      'SetLegendShow'
    ]),
  },
  watch: {
    'legendMsg2': {
      deep: true,
      handler: function(legendMsg2) {
        if (legendMsg2.legendAry.length > 0) {
          this.show();
        } else {
          this.hide();
        }
      }
    }
  }
}
/* eslint-disable */
</script>

<style scoped lang="less">
  .legend {
    min-height: 0.4rem;
    -webkit-transition: all 0.3s linear;
    transition: all 0.3s linear;
    background: rgba(36, 120, 160, 0.5);
    position: relative;
    color: #fff;
    padding: 0.1rem 0.05rem 0.1rem 0.1rem;
    width: 1.8rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 0.08rem;
    visibility: hidden;
    margin-bottom: 0.05rem;
    margin-left: 0;
    &.isShow {
      visibility: visible;
    }
    .no-wrap();
    .close {
      position: absolute;
      right: 0.02rem;
      top: 0.02rem;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('../../page/map/images/zoom-in');
      transform: rotate(-45deg);
      transition: all 0.1s linear;
      cursor: pointer;
      &:hover {
        transform: rotate(45deg);
      }
    }
    .small {
      position: absolute;
      right: 0.08rem;
      top: 0.06rem;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('../../page/map/images/up');
      cursor: pointer;
    }
  }
  .legend.isSmall {
    width: 0.4rem;
    margin-left: 1.4rem;
  }
  .panel-body {
    margin-top: 0.1rem;
  }
  .legendItemHeader, .legendItemValue {
    width: 1.2rem;
    vertical-align: middle;
    text-align: center;
    margin: auto;
    // text-align:
    // margin-left:auto;
    // margin-right:auto;
    font-size: 12px;
  }
  #legendDes {
    font-family: 隶书;
    font-size: 0.15rem;
    font-weight: bold;
    font-style: oblique;
    text-decoration: underline;
  }
  .new {
    display: block;
    float: left;
    width: 24%;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.16rem;
    margin-top: -2px;
  }
  .new_01 {
    width: 100% !important;
    height: auto !important;
    line-height: 0.35rem;
    font-size: 0.16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tu {
    vertical-align: middle;
    width: auto !important;
  }
  .panel-body {
    max-height: 3.75rem;
    overflow: auto;
  }
  #legendTip {
    /deep/ li {
      overflow: hidden;
    }
  }


</style>
