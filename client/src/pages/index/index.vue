<template>
  <!-- @click="clickHandle('test click', $event)" -->
  <div class="container">
    <slogan type='index'></slogan>
    <!-- 打开授权设置页面 -->
    <!-- <mp-button @click='opensetting'>opensetting</mp-button> -->
    <!-- <div class="location" @click="changelocation">
      <i class="iconfont icon-round"></i>
      <span>{{location}}</span>
      <i class="iconfont icon-tubiao_xiala"></i>
    </div> -->

    <swiper indicator-dots="true" autoplay="true" interval="2500" duration="500" circular="true">
      <block v-for="(x, i) in swiperlist" :key="i">
        <swiper-item>
          <img :src="x.url" class="slide-image" mode="widthFix">
        </swiper-item>
      </block>
    </swiper>
    <div class="join">
      <!-- <button class="joinbtn" hover-class="joinbtnhover" @click='toBZapply'>帮主招募</button>
      <button class="joinbtn" hover-class="joinbtnhover" @click='toGYSapply'>供应商入驻</button>
      <button class="joinbtn" hover-class="joinbtnhover" @click='tobangpai'>加入帮派</button> -->
      <div @click='toBZapply'> 
        <!-- widthFix -->
        <div class="bzzm imgcon">
          <img src="/static/img/bzzm.png" alt="" mode="">
        </div>
        <div>帮主招募</div>
      </div>
      <div @click='toGYSapply' >
        <div class="gysrz imgcon">
          <img src="/static/img/gysrz.png" alt="" mode="">
        </div>
        <div>供应商入驻</div>
      </div>
      <div @click='tobangpai'>
        <div class="jrbp imgcon">
          <img src="/static/img/jrbp.png" alt="" mode="">
        </div>
        <div>加入帮派</div>
      </div>
    </div>
    <div class="dailygoods">
      <goods-item v-for="(x,k) in goodslist" :key="k" :goodsinfo="x"></goods-item>
    </div>
    <!-- <div class='onbottom'>{{onbottom}}</div> -->
    <!-- <i-divider :content="onbottom"></i-divider> -->
    <i-divider content="已经到底啦"></i-divider>

    <auth-modal :show="authmodalshow"></auth-modal>
  </div>
</template>

<script>
import qc from 'wafer2-client-sdk'
import conf from '@/config'

import checkscope from "@/wxapis/check_scope";
import authorize from "@/wxapis/authorize";
import openSetting from "@/wxapis/openSetting";
import chooselocation from "@/wxapis/chooselocation";
import modal from "@/wxapis/modal";

import slogan from "@/components/slogan";
import goodsItem from "@/components/goodsitem";
import authModal from "@/components/authmodal";

import mpButton from "mpvue-weui/src/button";

export default {
  data() {
    return {
      authmodalshow: false,
      onbottom: '上划加载更多',
      loginstate:this.globalData.loginstate,
      userInfo: {},
      location: "点击查看周边好物",
      swiperlist: [],
      goodslist: []
    };
  },
  components: {
    slogan,
    mpButton,
    goodsItem,authModal
  },
  methods: {
    async changelocation() {
      // 检查定位授权
      let locationAuth = await checkscope("scope.userLocation"); //userInfo
      // console.log(66, locationAuth);
      if (!locationAuth) {
        let locationAuthRes = await authorize("scope.userLocation");
        // console.log(75, locationAuthRes);
        if (locationAuthRes.errMsg == "authorize:ok") {
          // 同意
          let location = await chooselocation() || {};
          this.location = location.name || '切换位置';
          console.log(location);
          
        } else {
          // 拒绝了
          let modalres = await modal({
            content: "打开定位可以看到离你最近的批发商哦",
            cancelText: "放弃推荐",
            confirmText: "打开定位"
          });
          // console.log(86, modalres);
          if (modalres) {
            // 打开设置页面
            let settingres = await openSetting();
            // console.log(settingres);
            if (settingres["scope.userLocation"]) {
              // 已打开定位
              wx.showToast({
                title: "定位打开成功",
                icon: "none",
                duration: 1000
              });
              let location = await chooselocation() || {};
              this.location = location.name || '切换位置';
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
        let location = await chooselocation() || {};
        this.location = location.name || '切换位置';
        console.log(location);
      }
    },
    toBZapply(){
      let url = `/pages/bangzhuapply/main`
      wx.navigateTo({
        url
      })
    },
    toGYSapply(){
      let url = `/pages/gysapply/main`
      wx.navigateTo({
        url
      })
    },
    tobangpai(){
      let url = `/pages/zutuan/main`
      wx.switchTab({
        url
      })
    },
    getgoodslist(){
      wx.showLoading({
        title:"商品加载中...",
        icon:'loding'
      })
      var self = this;
      qc.request({
        url: conf.service.goodslistUrl,
        // method:"POST",
        data:{},
        success:function(res) {
          // console.log('getgoodslist', res.data.data);
          if(res.data.data == []){
            self.onbottom = '已经到底啦！'
          }
          self.goodslist = res.data.data
        },
        fail(){
          wx.showToast({
            title:"获取商品列表失败",
            icon:"none",
            duration:1500
          })
        },
        complete(){
          wx.hideLoading()
          wx.stopPullDownRefresh()
        }
      })
    },
    getswiperlist(){
      var self = this;
      qc.request({
        url: conf.service.swiperUrl,
        data:{},
        success:function(res) {
          // console.log('getgoodslist', res.data.data);
          if(res.data.data != []){
            self.swiperlist = res.data.data
          }
          
        },
        fail(){
        },
        complete(){
        }
      })
    }
  },
  async onLoad(){
    console.log('index onload');
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getgoodslist()
    this.getswiperlist()
    // console.log('index 242 onLoad',this.globalData);
    // console.log('index globalData:',this.globalData );
    // console.log('index globalData.loginstate:',this.globalData.loginstate, this.globalData.loginstate == true );

    
  },
  onShow() {
    // console.log('index show');
    if(!this.globalData.loginstate){
      wx.showToast({
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
  },
  created () {
    console.log('index created');
    var self = this;
      // 调用登录接口
    const session = qc.Session.get();
    console.log('app session：', session);
    // if ( session ){
      console.log('二次登录@app.vue');
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qc.loginWithCode({
        success: res => {
          console.log('app res', res);
          self.globalData.loginstate = true
          self.globalData.userInfo = res
        },
        fail: err => {
          // console.error(err);
          self.globalData.loginstate = false
          self.globalData.userInfo = {}
          // self.showModel("登录错误", err.message);
          // if(this.globalData.loginstate !== true){
            // 弹窗强制授权
            // console.log('woyao 弹窗强制授权');
            wx.showToast({
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
          // }
        }
      });
    // }

  },
  onPullDownRefresh(){
    this.getgoodslist()
  },
  onReachBottom(){
    this.getgoodslist()
  },
};
</script>

<style scoped lang='scss'>
$maincolor: #ce4031;
.location {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // max-width: 70%;
  // margin: 0 auto 5rpx;
  i {
    display: inline;
  }
  span {
    display: inline-block;
    max-width: 60%;
    overflow: hidden;
    margin: 0 10rpx;
    word-break: keep-all;
    word-wrap: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
swiper {
  width: 710rpx;
  margin: 0 auto;
  height: 300rpx;
  margin-top: 20rpx;
  swiper-item {
    overflow: hidden;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    img {
      width: 100%;
      border: none;
    }
  }
}
.join {
  width: 710rpx;
  margin: 15rpx auto 0;
  padding: 10rpx 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  .joinbtn {
    background-color: #fff;
    color: $maincolor;
    border: 1px solid $maincolor;
    margin: 0;
    font-size: 36rpx;
  }
  .joinbtnhover {
    background-color: #eee;
  }
  .imgcon{
    // width: 150rpx;
    // height: 127.5rpx;
    width: 120rpx;
    height: 102rpx;
    // background-color: pink;
    overflow: hidden;
    margin: 0 auto;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .bzzm{
    text-align: center;
    img{
      width: 96%;
      height: 100%;
    }
  }
  .gysrz{
    text-align: center;
    img{
      width: 85%;
      height: 100%;
    }
  }
}
.onbottom{
  background-color: #fff;
  text-align: center;
  font-size: 20rpx;
  color: #aaa;
}
</style>
