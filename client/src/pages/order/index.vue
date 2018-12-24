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
    <div class="fahuo main">
      <div class="u">发货详情</div>
      <!-- 发货地 发货时间 发货方式 -->
      <div class="m">
        <table>
        <tr>
          <td>发货方式 :</td>
          <td>{{goodsdetail.deliveryMethods}}</td>
        </tr>
        <tr>
          <td>发货地 :</td>
          <td>{{goodsdetail.deliveryArea}}</td>
        </tr>
        <tr>
          <td>发货时间 :</td>
          <td>{{goodsdetail.deliveryTime}}</td>
        </tr>
        <tr>
          <td>可购区域 :</td>
          <td>{{goodsdetail.targetArea_name}}</td>
        </tr>
        <tr>
          <td>是否包邮 :</td>
          <td>{{goodsdetail.shipping?'包邮':'不包邮'}}</td>
        </tr>
      </table>
      </div>
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
import clientpaid from "@/wxapis/clientpaid";


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
      goodsdetail:{},
      img:'',
      goodsid:'',
      count:1
    };
  },
  components: {
    slogan,
    goodsItem
  },
  computed:{
    totalfee:function(){
      return (this.currentPrice * 10 * 10) * this.count / 100
    }
  },
  methods: {
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
        success:async function(res) {
          wx.hideLoading();
          console.log('统一下单返回：');
          console.log(res.data);
          if(res.data.code == 1 && res.data.success){
            console.log('支付中');
            let payres = await wxpay( res.data.data );
            console.log('payres', payres)
            console.log('支付流程结束，支付成功~')
            if(payres.errMsg == 'requestPayment:ok'){
              // 前端订单支付完成 等待商家核验（等待微信通知回调） 
              let clientpaidres = await clientpaid(res.data.data)
              console.log('前端订单支付完成 等待商家核验');
              
              wx.showToast({
                title: clientpaidres.msg, 
                duration: 1500,
                icon:'success',
                mask:true,
                complete:function(){
                  setTimeout(function(){
                    wx.navigateTo({
                      url:"/pages/orderlist/main?index=0"
                    })
                  },1500)
                }
              })
            }else{
              wx.showToast({
                title: '支付失败',
                 duration: 1000,
                  icon:'none',
                  mask:true ,
                  complete:function(){
                    wx.navigateTo({
                      url:"/pages/orderlist/main?index=0"
                    })
                  }
              })
            }
          }else{
            wx.showToast({
              title: res.data.data.reason,
              icon: 'none',
              duration: 2000,
              complete:function(){
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        },
        fail: function(err) {
          console.log(err);
          console.log('支付流程结束，支付失败~')
          // wx.hideLoading();
          wx.showToast({
              title: '下单失败,请先登录', 
              duration: 1000,
              icon:'none',
              mask:true,
              complete:function(){
                wx.switchTab({
                  url:"/pages/my/main"
                })
              }
          })

          
        },
        complete:function(){
          // wx.hideLoading();
        }
      });

    }
  },
  onShow(){
    // this.count = 1
    // let {goodsid, currentPrice, img} = this.$root.$mp.query
    let {goodsdetail} = this.$root.$mp.query
    console.log(goodsdetail);
    this.goodsdetail = JSON.parse(goodsdetail)
    // if(!goodsid){

    // }else{
    //   this.goodsid = goodsid
    //   this.img = img
    //   this.currentPrice = currentPrice
    // }
    
  }
};
</script>

<style scoped lang='scss'>
$maincolor: #ce4031;

.main{
  border-top: 20rpx solid #f5f5f5 ;
  padding: 20rpx 20rpx;
  .u{
    color: #b3b3b3;
    font-size: 32rpx;
    // font-size: 13pt;
    border-bottom: 1px solid #f5f5f5;
  }
}

.header{
  
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
        max-height: 150rpx;
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
.fahuo{
  .m{
    table{
      width: 80%;
      margin: 0 auto;
      font-size: 32rpx;
      color: #000;
      tr{
        display: flex;
        flex-direction: row;
        // justify-content: space-around;
        td:first-child{
          width: 30%;
        }
        td:last-child{
          width: 70%;
        }
      }
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
