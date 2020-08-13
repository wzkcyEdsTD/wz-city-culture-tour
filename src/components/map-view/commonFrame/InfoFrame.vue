<!--
 * @Author: eds
 * @Date: 2020-07-28 14:09:16
 * @LastEditTime: 2020-08-12 20:35:31
 * @LastEditors: eds
 * @Description:
 * @FilePath: \旅游\src\components\map-view\commonFrame\InfoFrame.vue
-->
<template>
  <div class="bimframe" v-if="isInfoFrame">
    <div class="_bimframe_">
      <i class="close" @click="closeBimFrame"></i>
      <div>
        <header>印象南塘</header>
        <div class="video">
          <video controls="controls" autoplay="autoplay" width="350" id="a">
            <source src="http://218.75.26.62/video/yxnt.mp4" type="video/mp4" />
          </video>
        </div>
        <div class="video">
          <p>监控接入</p>
          <iframe :src="rtmpURL"></iframe>
        </div>
        <div class="video"><strong>景点简介:</strong><br /> 温州南塘文化旅游区（印象南塘）位于温州市中部，北起锦绣路，南抵温州大道，定位为休闲、时尚、购物、餐饮、娱乐、文化为一体的综合性旅游文化商业区，被称为“温州城市客厅”，是温州新一批精品4A级景区的杰出代表。 “印象南塘”景区由南塘河、南塘风貌街、白鹿洲公园、文化村和庄头滨水公园等部分组成，总占地面积51.6万平方米。景区生态环境优良，管理制度健全，服务设施完备。主入口选址于白鹿洲公园，游客服务中心位于主入口东侧。整个景区采用统一的标识系统，停车场总面积达1.6万平方米。 南塘风貌街综合展现了瓯文化、永嘉学派、刘基文化、塘河文化、榕亭文化和非物质文化遗产，北段共由7幢江南水乡风格的商业用房沿河布局而成，南段计划打造成中医药特色街区。</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "InfoFrame",
  data() {
    return {
      rtmpURL:
        "http://10.36.226.3:8089/video/index.html?url=rtmp://172.20.23.37:1935/service/PuId-ChannelNo=127905000100000001-003569&PlayMethod=0&StreamingType=1&NetType=1&FCode=9",
    };
  },
  computed: {
    ...mapGetters("map", ["isInfoFrame"]),
  },
  beforeDestroy() {
    this.closeBimFrame();
  },
  methods: {
    ...mapActions("map", ["SetIsInfoFrame"]),
    closeBimFrame() {
      this.SetIsInfoFrame(false);
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./InfoFrame.less");
</style>
