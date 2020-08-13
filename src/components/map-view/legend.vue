<template>
  <transition
    enter-active-class="animated lightSpeedIn"
    leave-active-class="animated bounceOutDown"
  >
    <div class="legend" v-show="isShow" :class="{collapse:collapse2, isSmall: isSmall}">
      <!-- <div id="mapLegend" class="panel-heading" style="display: block;">
        <h5 class="panel-title text-center">
          <span data-i18n="resources.text_legend" id="legendDes">四色图图例</span>
        </h5>
      </div> -->
      <div v-show="!isSmall" class="panel-body text-center">
        <ul id="legendTip">
          <li v-for="(item, index) in legendMsg.legendAry" :key='index'>
            <span class="new">
              <img class="tu" :src="item.icon">
            </span>
            <!-- <el-tooltip class="item" effect="dark" :content="item.des" placement="top"> -->
            <div class="new_01">{{item.des}}</div>
            <!-- </el-tooltip> -->
          </li>
        </ul>
        <!-- <table>
          <tbody>
          <tr>
            <td class="legendItemHeader" data-i18n="resources.text_populationDensity">风险等级</td>
            <td class="legendItemValue" data-i18n="resources.text_color">图标</td>
          </tr>
          <tr>
            <td class="legendItemHeader"><img src="../../../static/image/level1.png"></td>
            <td class="legendItemValue" style="">一级</td>
          </tr>
          <tr>
            <td class="legendItemHeader"><img src="../../../static/image/level2.png"></td>
            <td class="legendItemValue" style="">二级</td>
          </tr>
          <tr>
            <td class="legendItemHeader"><img src="../../../static/image/level3.png"></td>
            <td class="legendItemValue" style="">三级</td>
          </tr>
          <tr>
            <td class="legendItemHeader"><img src="../../../static/image/level4.png"></td>
            <td class="legendItemValue" style="">四级</td>
          </tr>
          </tbody>
        </table> -->
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
    legendMsg: {
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
      isShow: true,
      isSmall: false
      // legendValue1: '0',
      // legendValue2: '0',
      // legendValue3: '0',
      // legendValue4: '0'
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
      this.SetLegendShow(this.isShow)
    },
    hide() {
      this.isShow = false
      this.SetLegendShow(this.isShow)
    },
    small() {
      this.isSmall = !this.isSmall
    },
    ...mapActions('map', [
      'SetLegendShow'
    ]),
  },
  watch: {
    'legendMsg': {
      deep: true,
      handler: function(legendMsg) {
        // $("#legendTip").empty();
        if (legendMsg.legendAry.length > 0) {
          // for (var i = 0; i < legendMsg.legendAry.length; i++) {
          //   $("#legendTip").append('<li><span class="new"><img src="' + legendMsg.legendAry[i].icon + '"  class="tu"></span><el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start"><div class="new_01">' + legendMsg.legendAry[i].des + '</div></el-tooltip></li>');
          // }
          $(".new").css({
            "display": "block",
            "float": "left",
            "width": "24%",
            "height": "35px",
            "margin-top": "-2px"
          });
          $(".tu").css({
            "vertical-align": "middle",
            "width": "30px"
          });
          $(".new_01").css({
            "float": "left",
            "width": "76%",
            "height": "35px",
            "line-height": "35px",
            "font-size": "16px",
            "white-space": "nowrap",
            "overflow": "hidden",
            "text-overflow": "ellipsis"
          });
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
    margin-left: 0;
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
    float: left;
    width: 76%;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tu {
    vertical-align: middle;
    width: 0.3rem;
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
