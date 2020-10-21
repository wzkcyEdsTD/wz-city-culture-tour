<template>
  <div class="target-wrapper">
    <span class="header">教育体征</span>
    <ul class="content">
      <li class="item">
        <img src="/static/images/index/education/总在校学生数.png" />
        <div>
          <div class="title">
            总在校学生数
            <span class="small">(人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="1413362" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/education/教职工数.png" />
        <div>
          <div class="title">
            教职工数
            <span class="small">(人)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="142311" decimals="0" />
          </div>
        </div>
      </li>
      <!-- <li class="item">
        <img src="/static/images/index/education/总占地面积.png" />
        <div>
          <div class="title">
            总占地面积
            <span class="small">(公顷)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="4016.87" />
          </div>
        </div>
      </li> -->
      <li class="item">
        <img src="/static/images/index/education/幼儿园数量.png" />
        <div>
          <div class="title">
            幼儿园数量
            <span class="small">(所)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="1405" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/education/小学数量.png" />
        <div>
          <div class="title">
            小学数量
            <span class="small">(所)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="568" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/education/初中数量.png" />
        <div>
          <div class="title">
            初中数量
            <span class="small">(所)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="339" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/education/高中数量.png" />
        <div>
          <div class="title">
            高中数量
            <span class="small">(所)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="103" decimals="0" />
          </div>
        </div>
      </li>
      <li class="item">
        <img src="/static/images/index/education/中职学校数量.png" />
        <div>
          <div class="title">
            中职学校数量
            <span class="small">(所)</span>
          </div>
          <div class="desc">
            温州全市 /
            <span>当年</span>
          </div>
          <div class="number">
            <DynamicNum :value="37" decimals="0" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import DynamicNum from "../dynamicNum";

export default {
  name: "educationIndex",
  components: { DynamicNum }
};
</script>
