<template>
  <div class="container">
    <swiper indicator-dots="true" circular="true" next-margin="0" previous-margin="0">
      <block v-for="(x, i) in goodsdetail.urls" :key="i">
        <swiper-item>
          <img :src="x" class="slide-image" mode>
        </swiper-item>
      </block>
    </swiper>
    <div class="head">
      <div class="title">{{goodsdetail.name}}</div>
      <div class="brdesc">{{goodsdetail.briefDesc}}</div>
    </div>
    <!-- #f9ffea -->
    <div class="price">
      <div class="up">
        <div class="l">
          <div class="nowprice">
            <div class="tag">批物价</div>
            <div class="nowmoney">￥{{goodsdetail.currentPrice}}</div>
          </div>
          <div class="oldprice">
            <div class="tag">市场价</div>
            <div class="oldmoney">￥{{goodsdetail.oldPrice}}</div>
          </div>
        </div>
        <div class="r">
          <div class="tag">各大商超价</div>
          <div
            class="marketprice"
            v-for="(x,i) in goodsdetail.marketPrice"
            :key="i"
          >{{x.name}}:￥{{x.price}}</div>
        </div>
      </div>
      <div class="down">
        <i class="iconfont icon-kucunguanli"></i>
        商品库存{{goodsdetail.stock}}件
      </div>
    </div>
    <div class="foot">
      <div class="item s part1">
        <div @click="routeToHome">
          <i class="iconfont icon-shouye"></i>
          前往首页
        </div>
        <div @click="contact">
          <i class="iconfont icon-dianhua"></i>
          联系商家
        </div>
      </div>
      <div class="item b part4">
        <!-- 加入购物车 -->
      </div>
      <div class="item b part5" hover-class="hoverbtn" @click="buynow">立即购买</div>
    </div>
  </div>
</template>

<script>
import checkscope from "@/wxapis/check_scope";
import authorize from "@/wxapis/authorize";
import openSetting from "@/wxapis/openSetting";
import chooselocation from "@/wxapis/chooselocation";
import modal from "@/wxapis/modal";
import qc from 'wafer2-client-sdk'
import conf from '@/config'

import slogan from "@/components/slogan";
import goodsItem from "@/components/goodsitem";


export default {
  data() {
    return {
      motto: "Hello World",
      userInfo: {},
      location: "尚未获取定位",
      goodsdetail: {},
      count:1
    };
  },
  components: {
    slogan,
    goodsItem
  },
  methods: {
    routeToHome() {
      let url = "/pages/index/main";
      wx.switchTab({ url });
    },
    contact() {},
    buynow() {
      console.log("buynow");
      let url = `/pages/order/main?goodsdetail=${JSON.stringify(this.goodsdetail)}`
      wx.navigateTo({url})
    }
  },
  onShow(){
    let goodsid = this.$root.$mp.query.goodsid
    console.log('goodsid:',goodsid);
    
    var self = this;
      qc.request({
        url: conf.service.goodsdetailUrl,
        // method:"POST",
        data:{
          goodsid
        },
        success:function(res) {
          console.log('goodsdetail', res.data.data);
          self.goodsdetail = res.data.data
        },
        fail(){
          wx.showToast({
            title:"获取商品详情失败",
            duration:1500
          })
        }
      })
  }
};
</script>

<style scoped lang='scss'>
$maincolor: #ce4031;

swiper {
  width: 750rpx;
  height: 562.5rpx;
  swiper-item {
    width: 750rpx;
    height: 562.5rpx;
    img {
      display: flex;
      width: 750rpx;
      height: 562.5rpx;
    }
  }
}
.head {
  padding: 20rpx 0;
  text-align: center;
  .title {
    font-size: 40rpx;
    font-weight: 700;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 auto;
  }
  .brdesc {
    color: rgb(107, 107, 107);
    max-width: 80%;
    margin: 0 auto;
  }
}
.price {
  background-color: #f9ffea;
  padding: 20rpx 20rpx;
  .up {
    display: flex;
    flex-direction: row;
    .l {
      width: 65%;
      display: flex;
      flex-direction: row;
      .nowmoney {
        font-size: 60rpx;
        color: $maincolor;
        height: 100rpx;
      }
      .oldmoney {
        height: 100rpx;
        line-height: 100rpx;
        text-decoration: line-through;
        color: #c0c0c0;
      }
    }
    .r {
      width: 35%;
      .marketprice {
        font-size: 28rpx;
      }
    }
    .tag {
      background-color: #ffebcf;
      font-size: 24rpx;
      text-align: center;
      height: 30rpx;
      line-height: 30rpx;
      border-radius: 15rpx;
      display: inline-block;
      padding: 0 15rpx;
      margin: 0 auto;
    }
  }
  .down {
    color: rgb(141, 141, 141);
    border-top: 1px solid #eafcbe;
    display: flex;
    flex-direction: row;
    align-items: center;
    i {
      color: $maincolor;
    }
  }
}
.countchange{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    button{
      width: 60rpx;
      height: 60rpx;
      padding: 0;
      line-height: 60rpx;
      text-align: center;
      font-size: 40rpx;
      margin: 0;
    }
    input{
      width: 100rpx;
      height: 60rpx;
      padding: 0;
      line-height: 60rpx;
      text-align: center;
      font-size: 40rpx;
    }
  }
.foot {
  position: fixed;
  bottom: 0;
  width: 750rpx;
  height: 100rpx;
  padding: 20rpx 0 0rpx;
  display: flex;
  flex-direction: row;
  z-index: 9999;
  .s {
    width: 40%;
    display: flex;
    flex-direction: row;
    text-align: center;
    font-size: 26rpx;
    height: 100rpx;
    overflow: hidden;
    & > div {
      width: 50%;
    }
    i {
      font-size: 34rpx;
    }
  }
  .b {
    height: 100rpx;
    line-height: 100rpx;
    width: 30%;
  }
  .part4 {
    // background-color: #ffe900;
    color: #000;
    font-size: 40rpx;
  }
  .part5 {
    background-color: $maincolor;
    color: #fff;
    font-size: 40rpx;
    text-align: center;
  }
  .hoverbtn {
    background-color: #9c2518;
  }
}
</style>
