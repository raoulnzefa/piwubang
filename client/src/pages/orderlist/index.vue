<template>
  <div class="container">
    <div class="nav">
      <nav-bar :tabs="tabs" :activeIndex="index" @tabClick="tabClick"></nav-bar>
    </div>
    <div class="main">
      <orderlist-item v-for='(x,i) in which' :key="i" :orderinfo="x"></orderlist-item>  
    </div>
    <div class="nothing">
      <i class="iconfont icon-quanbudingdan01"></i>
      <div>您还没有相关订单</div>
    </div>
    

  </div>
</template>

<script>
import checkscope from "@/wxapis/check_scope";
import authorize from "@/wxapis/authorize";
import openSetting from "@/wxapis/openSetting";
import modal from "@/wxapis/modal";
import qc from 'wafer2-client-sdk'
import conf from '@/config'
// 组件：
// import mpNavbar from 'mpvue-weui/src/navbar';

import navBar from '@/components/navbar';
import orderlistItem from '@/components/orderlistitem';

/*
 * 订单状态定义：
 * 下单 但取消支付
 * 1 : 下单，但未支付。可以做的事：支付，关闭订单
 * 2 : 前台已支付完成，把订单设置为‘商户确认中’状态，注意只有当status=1的订单才能改 。可以做的事：不可操作
 * 下单 确定点了支付
 * (废弃)2 : 商户查询结果是未支付。可以做的事：支付
 * (废弃)3 : 商户查询结果是已支付 处于已支付，待发货状态。可以做的事：退款
 * 4 : 商户收到了来自微信的通知，订单已支付。需要判断订单是否已发货，处于已发货，则不改写订单status；如果处于未发货则修改为4。可以做的事：退款
 * 5 : 卖家已发货，订单处于发货状态。可以做的事：确认收货
 * 6 : 用户确认收货，订单完结（1）。可以做的事：退款申请，删除订单
 * 7 : 用户发起了退款申请，且status=3/4，直接退款，订单置为7，即已退款，并且订单关闭，无法再操作，订单完结（2）。可以做的事：删除订单
 * 8 : 用户发起了退款申请，且status=6 才可以发起退货，要求输入运单号，提交申请，处于待商家待收货阶段
 * 9 : 商家核验退货完成，在平台操作  给予退款 且完成，关闭订单，无法再操作，订单完结（3）。可以做的事：删除订单
 */ 

export default {
  data() {
    return {
      tabs: ['全部','待付款','待发货','已发货','交易结束','售后'],
      tabstate:['all','unpay','undelivery','delivery','over','service'],
      all:[],
      unpay:[],
      undelivery:[],
      delivery:[],
      over:[],
      service:[],
      which:[],
      index:0
    };
  },
  components: {
    navBar, orderlistItem
  },
  onLoad(){
    let routeParam = this.$root.$mp.query
    console.log(routeParam);
    this.index = parseInt(routeParam.index)
  },
  onShow() {
    wx.showToast({
        title: 'Loading', 
        duration: 1000,
        icon:'loading',
        mask:true
    })
    var self = this
    qc.request({
        login:true,
        url: conf.service.getOrderList,
        // method:"POST",
        data:{
          state : 'all'
        },
        success:function(res) {
          console.log(res.data.data);
          self.all = res.data.data
          self.unpay = res.data.data.filter(function(v, i){
            return v.status == 1 || v.status == 2
          })
          self.undelivery = res.data.data.filter(function(v, i){
            return v.status == 3 || v.status == 4
          })
          self.delivery = res.data.data.filter(function(v, i){
            return v.status == 5
          })
          self.over = res.data.data.filter(function(v, i){
            return v.status == 6 || v.status == 7 || v.status == 9
          })
          self.service = res.data.data.filter(function(v, i){
            return v.status == 7 || v.status == 8 || v.status == 9
          })
          self.which = self[self.tabstate[self.index]]
          wx.hideToast()
        },
        fail: function(err) {
          console.log(err);
          wx.showToast({
              title: '请先登录', 
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
  methods: {
    tabClick:function(x){
      console.log(x);
      this.index = x
      this.which = this[this.tabstate[x]]
      console.log('which:',this.which);
    }
    
  }
};
</script>

<style lang='scss'>
$maincolor: #ce4031;
.weui-navbar__item.weui-bar__item_on {
  color: $maincolor!important;
}
.weui-navbar-slider-on.data-v-79639602 {
  background-color: #ce4031!important;
}
</style>
<style scoped lang='scss'>
  $maincolor: #ce4031;
  .nav{
    position: fixed;
    top: 0;
    width:100%;
    height: 106rpx;
    background-color:#fff;
    z-index: 999;
  }
  .main{
    padding-top: 106rpx;
  }
  .nothing{
    display:flex;
    flex-direction: column;
    justify-content:center;
    padding-top: 50rpx;
    i{
      font-size:200rpx;
      line-height:200rpx;
      text-align:center;
      color: #ccc;
    }
    div{
      font-size:34rpx;
      text-align:center;
    }
  }

</style>
