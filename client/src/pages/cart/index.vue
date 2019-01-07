<template>
  <!-- @click="clickHandle('test click', $event)" -->
  <div class="container">
    <div class="main" v-for='(x,i) in cartgoods' :key="i">
      <div class="header">
      <div class="u">商品详情</div>
      <div class="m">
        <div class="l" @click="todetail(x)">
          <img :src="x.thumbnail" mode='widthFix' alt="">
        </div>
        <div class="m" @click="todetail(x)">
          <div>{{x.goodsname}}</div>
          <div class='desc'>{{x.desc}}</div>          
        </div>
        <div class="r">
          <div class='u'>￥{{x.price}}</div>
          <div class='b'>
            <button @click="x.count>1?x.count--:''" :disabled='x.count<=1'>-</button>
            <input type="text" v-model='x.count' disabled>
            <button @click="x.count++">+</button>
          </div>
        </div>
      </div>
    </div>
    <div class="fahuo">
      <div class="u">注意事项</div>
      <!-- 发货地 发货时间 发货方式 -->
      <div class="m">
        <div class="table">
        <div class="tr">
          <div>发货方式 :</div>
          <div class="tips">{{x.deliveryMethods || '商家未注明'}}</div>
          <div>发货地 :</div>
          <div>{{x.deliveryArea || '商家未注明'}}</div>
        </div>
        <div class="tr">
          <div>发货时间 :</div>
          <div>{{x.deliveryTime || '商家未注明'}}</div>
          <div>可购区域 :</div>
          <div class="tips">{{x.targetArea_name || '商家未注明'}}</div>
        </div>
        <div class="tr">
          <div>是否包邮 :</div>
          <div>{{x.shipping?'包邮':'不包邮'}}</div>
        </div>
      </div>
      </div>
    </div>
    <div class="jiesuan">
      <button class='pay' hover-class='btnhover' @click='buy(x)'>结算</button>
    </div>
    </div>
    <!-- <div class="foot">
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
    </div> -->
    <i-divider content="已经到底啦" v-if="!shownone"></i-divider>
    <div class="none" v-if="shownone">
      <i class="iconfont icon-tubiao_gouwuche-copy"></i>
      <div>购物车空空如也~</div>
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

import qc from '@/wafer2-client-sdk'
import conf from '@/config'

import slogan from "@/components/slogan";
import goodsItem from "@/components/goodsitem";

export default {
  data() {
    return {
      cartgoods:[],
      shownone:false,
      userInfo: {},
      location: "尚未获取定位",
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
  },
  methods: {
    async buy(x) {
      wx.showLoading({
        title: 'Loading...',
      })
      // 统一下单 生成订单号
      // qcloud.request  https://github.com/tencentyun/wafer-client-sdk#request
      qc.request({
        // login:true,
        url: conf.service.prepayUrl,
        // method:"POST",
        data:{
          count: x.count,
          _id: x.goodsid
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

    },
    async paynow() {
      wx.showLoading({
        title: 'Loading...',
      })
      // 统一下单 生成订单号
      // qcloud.request  https://github.com/tencentyun/wafer-client-sdk#request
      qc.request({
        // login:true,
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

    },
    getcartgoods(){
      var self = this
      wx.showLoading({
        title: '购物车读取中...',
      })
      qc.request({
        // login:true,
        url: conf.service.cartgoodsUrl,
        // method:"GET",
        data:{},
        success:function(res) {
          console.log(res);
          if(res.data.success){
            self.cartgoods = res.data.data
            let length = res.data.data.length
            self.shownone = length == 0?true:false
            wx.setTabBarBadge({
              index: 3,
              text: length + ''
            })
          }else{
            wx.showToast({
              title: '购物车读取失败',
              icon:'none'
            })
            wx.removeTabBarBadge({
              index : 3
            })
          }
        },
        fail: function(err) {
          console.log(err);
          wx.removeTabBarBadge({
            index : 3
          })
        },
        complete:function(){
          wx.stopPullDownRefresh()
          wx.hideLoading();
          
        }
      });
    },
    todetail(x){
      if(x.goodsid){
        wx.navigateTo({
          url:`/pages/goodsdetail/main?goodsid=${x.goodsid}`
        })
      }
    }
  },
  onShow(){
    if(!this.globalData.loginstate){
        return wx.showToast({
            title:"请先登录哦",
            icon:"none",
            mask:true,
            duration:1500,
            success(){
            setTimeout(function(){
                wx.switchTab({url:"/pages/my/main"})
            },1500)
            }
        })
    }
    this.getcartgoods()
  },
  onLoad(){
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onPullDownRefresh(){
    this.getcartgoods()
  }
};
</script>

<style scoped lang='scss'>
$maincolor: #ce4031;

.main{
  border-top: 20rpx solid #f5f5f5 ;
  padding: 0 20rpx 10rpx;
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
    padding: 10rpx 0 0;
    border-bottom: 1px solid #f5f5f5;
    .l{
      width: 25%;
      img{
        width: 160rpx;
        height: 120rpx;
      }
    }
    .m{
      width: 50%;
      text-align: left!important;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding-left: 25rpx;
      font-size: 32rpx;
      div{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        
      }
      .desc{
        font-size: 28rpx;
        color: #b3b3b3;
      }
    }
    .r{
      width: 25%;
      font-size: 32rpx;
      text-align: center!important;
      .b{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding: 0;
        button{
          width: 34rpx;
          height: 34rpx;
          padding: 0;
          line-height: 34rpx;
          text-align: center;
          font-size: 20rpx;
          margin: 0;
        }
        input{
          width: 100rpx;
          height: 34rpx;
          padding: 0;
          line-height: 34rpx;
          text-align: center;
          font-size: 20rpx;
        }
      }
    }
  }
}
.fahuo{
  .m{
    .table{
      width: 100%;
      margin: 0 auto;
      font-size: 28rpx;
      color: #000;
      .tr{
        display: flex;
        flex-direction: row;
        width: 100%;
        div{
          width: 20%;
        }
        div:nth-child(3){
          margin-left: 40rpx;
        }
        .tips{
          color: $maincolor;
        }
      }
      
    }
  }
}
.jiesuan{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  button{
    width: 150rpx;
    height: 44rpx;
    line-height: 44rpx;
    background-color: $maincolor;
    color: #fff;
    font-size: 32rpx;
    text-align: center;
    margin: 0;
  }
  .btnhover{
    background-color: #9c2518;
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
  background-color: #fff;
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
.none{
  display: flex;
  flex-direction: column;
  justify-content: center;
  i.iconfont{
    font-size: 200rpx;
    color: #b3b3b3;
    text-align: center;
  }
  div{
    font-size: 50rpx;
    text-align: center;
    color: #b3b3b3;
  }

}
</style>
