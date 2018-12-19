<template>
  <!-- @click="clickHandle('test click', $event)" -->
  <div class="container">
    <div class="header main">
      <div class="u">订单详情</div>
      <div class="m">
        <div class="l">
          <img :src="goodsdetail.urls[0]" mode='widthFix' alt="">
        </div>
        <div class="m">
          {{goodsdetail.name}}
        </div>
        <div class="r">
          ￥{{goodsdetail.currentPrice}}
        </div>
      </div>
      <div class="d">
          数量：
          <button @click="count>1?count--:''" :disabled='count<=1'>-</button>
          <input type="text" v-model='count' disabled>
          <button @click="count++">+</button>
      </div>

    </div>
    <div class="main">
      <div class="u">发货详情</div>
      
    </div>
    <div class="main"></div>


    <!--  -->
    <div class="foot">
      <div class="item s part1">
        <div @click="routeToHome">
          <i class="iconfont icon-shouye"></i>
          返回首页
        </div>
      </div>
      <div class="item b part4">
        总计:￥{{totalfee || 0}}
      </div>
      <div class="item b part5" hover-class="hoverbtn" @click="paynow">确认付款</div>
    </div>
  </div>
</template>

<script>
import checkscope from "@/wxapis/check_scope";
import authorize from "@/wxapis/authorize";
import openSetting from "@/wxapis/openSetting";
import chooselocation from "@/wxapis/chooselocation";
import modal from "@/wxapis/modal";
import wxpay from "@/wxapis/wxpay";

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
      },
      count:1
    };
  },
  components: {
    slogan,
    goodsItem
  },
  computed:{
    totalfee:function(){
      return this.count * this.goodsdetail.currentPrice
    }
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
    async paynow() {
      wx.showLoading({
        title: 'Loading...',
      })
      // 统一下单 生成订单号
      // qcloud.request  https://github.com/tencentyun/wafer-client-sdk#request
      qc.request({
        login:true,
        url: conf.service.prepayUrl,
        // method:"POST",
        data:{
          count: this.count,
          _id: this.goodsdetail._id
        },
        success: function(res) {
          wx.hideLoading();
          console.log(res.data);
          if(res.data.code == 1 && res.data.success){
            console.log('支付中');
            wxpay( res.data.data )
            
            
          }else{
            wx.showToast({
              title: res.data.data.reason,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(err) {
          console.log(err);
          wx.hideLoading();
        },
        complete:function(){
          // wx.hideLoading();
        }
      });

    }
  }
};
</script>

<style scoped lang='scss'>
$maincolor: #ce4031;

.main{
  border-top: 20rpx solid #f5f5f5 ;
  padding: 20rpx 20rpx;
}

.header{
  .u{
    color: #b3b3b3;
    font-size: 32rpx;
    border-bottom: 1px solid #f5f5f5;
  }
  &>.m{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 20rpx 0;
    border-bottom: 1px solid #f5f5f5;
    .l{
      width: 25%;
      img{
        width: 90%;
      }
    }
    .m{
      width: 50%;
      text-align: left!important;
      display: flex;
      justify-content: flex-start;
      padding-left: 25rpx;
      font-size: 32rpx;
    }
    .r{
      width: 25%;
      font-size: 32rpx;
      text-align: center!important;
    }
  }
  .d{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 20rpx 0 0;
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
    width: 24%;
    display: flex;
    flex-direction: row;
    text-align: center;
    font-size: 26rpx;
    height: 100rpx;
    overflow: hidden;
    & > div {
      width: 100%;
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
    font-size: 35rpx;
    width: 46%;
    color: $maincolor;
    text-align: center;
    font-weight: 700;
  }
  .part5 {
    background-color: $maincolor;
    color: #fff;
    font-size: 35rpx;
    text-align: center;
  }
  .hoverbtn {
    background-color: #9c2518;
  }
}
</style>
