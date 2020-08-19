<template>
  <div id="menu" ref="" v-show="isShow">
    <!-- <img src="../../../static/image/close.png" width="26" @click="onclick(0)"/> -->
    <button onclick="closeMenu()" class="close-button" type="button" aria-label="Close popup">×</button>
    <div id="menu-content">
      <input id='basic' type='radio' name='rtoggle' value='standard-raster' checked='checked'>
      <label for='basic'>标准底图</label><br/>
      <input id='dark' type='radio' name='rtoggle' value='bigdata-raster'>
      <label for='dark'>大数据底图</label>
      <input id='2012' type='radio' name='rtoggle' value='2012YX'>
      <label for='2012'>2012影像</label>
      <input id='2014' type='radio' name='rtoggle' value='2014YX'>
      <label for='2014'>2014影像</label>
      <input id='2017' type='radio' name='rtoggle' value='2017YX'>
      <label for='2017'>2017影像</label>
      <input id='2018' type='radio' name='rtoggle' value='2018YX'>
      <label for='2018'>2018影像</label>
      <!-- <input id='arcgis' type='radio' name='rtoggle' value='ArcGIS-raster'>
      <label for='arcgis'>ArcGIS栅格</label> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showSwicthMenu: {
      type: Boolean,
      defaule() {
        return false
      }
    },
    currentCheck: {
      type: String,
      defaule() {
        return ''
      }
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  mounted() {
    var __this = this;
    window.closeMenu = function() {
      __this.isShow = false;
      __this.$emit("hideBasemapMenu", true);
    }

    $('input:radio[name="rtoggle"]').click(function(){
      var checkValue = $('input:radio[name="rtoggle"]:checked').val(); 
      // console.log("checkValue: " + checkValue);
      __this.$emit("checkValue", checkValue);
    });
  },
  methods: {

  },
  watch: {
    'showSwicthMenu'(showSwicthMenu) {
      if(showSwicthMenu) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    'currentCheck'(currentCheck) {
      if('bigdata-raster'===currentCheck) {
        // console.log('111')
        $('#basic').removeAttr('checked');
        $('#dark').attr('checked', 'checked');
      }
    }
  }
}
/* eslint-disable */
</script>

<style lang="less" scoped>
  #menu {
      position: absolute;
      z-index: 2;
      padding: 6px 0 6px 10px;
      margin-right: 20px;
      left: 14%;
      top: 6%;
      float: left;
      border-radius: 4px;
      -moz-box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);
      -webkit-box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);
      box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      background: #fff;
      width: 12%;
  }
  #menu-content {
      margin-right: 20%;
  }
  label {
      display: inline-block;
      max-width: 100%;
      margin-bottom: 5px;
      font-weight: 700;
      margin: 0;
      margin-right: 10px;
      font-size: 0.15rem;
  }
  input[type=radio] {
      margin: 4px 4px 0 0;
      line-height: normal;
      box-sizing: border-box;
      padding: 0;
  }
  img{
      position: absolute;
      right: 0;
      top: 4px;
      cursor:pointer;
  }
  .close-button {
    // top: 0.05rem;
    right: 0.05rem;
    z-index: 1;
    font-size: 0.16rem;
    cursor: pointer;
    &:hover {
      background: transparent !important;
    }
    position: absolute;
    border: 0;
    border-radius: 0 3px 0 0;
    background-color: transparent;
  }
</style>
