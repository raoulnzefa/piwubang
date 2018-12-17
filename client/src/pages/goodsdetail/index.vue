<template>
  <!-- @click="clickHandle('test click', $event)" -->
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

// import mpButton from "mpvue-weui/src/button";

export default {
  data() {
    return {
      motto: "Hello World",
      userInfo: {},
      location: "尚未获取定位",

      goodsdetail: {
        _id: "asd13as1d",
        name: "智利车厘子",
        briefDesc: "智利车厘子",
        soldCount: "125",
        currentPrice: "32",
        oldPrice: "59",
        stock: 456,
        marketPrice: [
          {
            name: "欧尚",
            price: "44"
          },
          {
            name: "大润发",
            price: "48.5"
          }
        ],
        urls: [
          "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/yingtao1.png",
          "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E6%A8%B1%E6%A1%832.png"
        ]
      }
    };
  },
  components: {
    slogan,
    goodsItem
  },
  methods: {
    bindViewTap() {
      const url = "../logs/main";
      wx.navigateTo({ url });
    },
    getUserInfo() {
      console.log("getuserinfo");

      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
            }
          });
        }
      });
    },
    clickHandle(msg, ev) {
      console.log("clickHandle:", msg, ev);
    },
    async changelocation() {
      // 检查定位授权
      let locationAuth = await checkscope("scope.userLocation"); //userInfo
      console.log(66, locationAuth);
      if (!locationAuth) {
        let locationAuthRes = await authorize("scope.userLocation");
        console.log(75, locationAuthRes);
        if (locationAuthRes.errMsg == "authorize:ok") {
          // 同意
          let location = await chooselocation();
          console.log(location);
        } else {
          // 拒绝了
          let modalres = await modal({
            content: "打开定位可以看到离你最近的批发商哦",
            cancelText: "放弃推荐",
            confirmText: "打开定位"
          });
          console.log(86, modalres);
          if (modalres) {
            // 打开设置页面
            let settingres = await openSetting();
            console.log(settingres);
            if (settingres["scope.userLocation"]) {
              // 已打开定位
              wx.showToast({
                title: "定位打开成功",
                icon: "none",
                duration: 1000
              });
              let location = await chooselocation();
              console.log(location);
            } else {
              wx.showToast({
                title: "您没有打开定位",
                icon: "none",
                duration: 1000
              });
            }
          }
        }
      } else {
        let location = await chooselocation();
        console.log(location);
        this.location = location.name;
      }
    },
    routeToHome() {
      let url = "/pages/index/main";
      // console.log(url);
      wx.switchTab({ url });
    },
    contact() {},
    buynow() {
      console.log("buynow");
      // https://developers.weixin.qq.com/miniprogram/dev/api/wx.requestPayment.html
      // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_3&index=1
      // 有点复杂 需要通读API
      // wx.requestPayment({
      //   timeStamp:new Date().getTime()+'',
      //   nonceStr:"as3da3sd3asd35a3s5d13as1d3",
      //   package:'',
      //   signType:"",//默认MD5
      //   paySign:'',
      //   success:function(){
      //     console.log('success');
      //   },
      //   fail:function(){
      //     console.log('fail');

      //   },
      //   complete:function(){
      //     console.log('complete');
      //   }
      // })

      // 跳转至订单页
      // let url = "/pages/order/main";
      // // console.log(url);
      // wx.navigateTo({ url });

      // 测试支付
      //qcloud.request  https://github.com/tencentyun/wafer-client-sdk#request
      qc.request({
        url: conf.service.prepayUrl,
        method:"POST",
        data:{
          orderCode:'asd7as7d89a79s8d',//商户订单号
          money:'0.22',
          orderID:'asd7as7d89a79s8d',
        },
        success: function(response) {
          console.log(response);
        },
        fail: function(err) {
          console.log(err);
        }
      });
    }
  }
};
</script>

<style scoped lang='scss'>
$maincolor: #ce4031;

swiper {
  width: 750rpx;
  height: 450rpx;
  swiper-item {
    width: 750rpx;
    img {
      display: flex;
      width: 750rpx;
      height: 100%;
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
