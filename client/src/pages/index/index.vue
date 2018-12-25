<template>
  <!-- @click="clickHandle('test click', $event)" -->
  <div class="container">
    <slogan type='index'></slogan>

    <!-- 打开授权设置页面 -->
    <!-- <mp-button @click='opensetting'>opensetting</mp-button> -->
    <div class="location" @click="changelocation">
      <i class="iconfont icon-round"></i>
      <span>{{location}}</span>
      <i class="iconfont icon-tubiao_xiala"></i>
    </div>

    <swiper indicator-dots="true" autoplay="true" interval="2500" duration="500" circular="true">
      <block v-for="(x, i) in swiperUrls" :key="i">
        <swiper-item>
          <img :src="x.url" class="slide-image" mode="widthFix">
        </swiper-item>
      </block>
    </swiper>
    <div class="join">
      <button class="joinbtn" hover-class="joinbtnhover" @click='toBZapply'>帮主招募</button>
      <button class="joinbtn" hover-class="joinbtnhover" @click='toGYSapply'>供应商入驻</button>
      <button class="joinbtn" hover-class="joinbtnhover" @click='tobangpai'>加入帮派</button>
    </div>
    <div class="dailygoods">
      <goods-item v-for="(x,k) in goodslist" :key="k" :goodsinfo="x"></goods-item>
    </div>
    <div class='onbottom'>{{onbottom}}</div>
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
      swiperUrls: [
        {
          id: 1,
          url:
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/yingtao1.png"
        },
        {
          id: 2,
          url:
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E6%A8%B1%E6%A1%832.png"
        },
        {
          id: 3,
          url:
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E7%8C%95%E7%8C%B4%E6%A1%831.png"
        }
      ],
      goodslist: []
    };
  },
  components: {
    slogan,
    mpButton,
    goodsItem,authModal
  },
  methods: {
    
    // 登录授权检查
    loginCheck:async function(){
      var self = this;
      return new Promise(function(resolve, reject){
        // 授权检查
        wx.getSetting({
          success(res) {
            console.log('appjs authSetting:',res.authSetting);
            // let
            if (res.authSetting["scope.userInfo"]) {
              // 已授权
              wx.getUserInfo({
                success: res => {
                  self.globalData.userInfo = res.userInfo;
                  console.log('已授过权');
                  resolve({
                    state:true,
                    userInfo:res.userInfo
                  })
                }
              });
            } else if(res.authSetting["scope.userInfo"] === false){
              // 拒绝过授权
              console.log('拒绝过授权');
              resolve({
                    state:'rejected',
                    userInfo:null
                  })
            }else{
              // 
              console.log('尚未授过权');
              resolve({
                    state:false,
                    userInfo:null
                  })
            }
          }
        });
      })
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
          this.location = location.name;
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
              this.location = location.name;
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
        this.location = location.name;
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
        title:"卖力加载中...",
        icon:'loding'
      })
      var self = this;
      qc.request({
        url: conf.service.goodslistUrl,
        // method:"POST",
        data:{},
        success:function(res) {
          console.log('getgoodslist', res.data.data);
          if(res.data.data == []){
            self.onbottom = '已经到底啦！'
          }
          self.goodslist = res.data.data
        },
        fail(){
          wx.showToast({
            title:"获取商品列表失败",
            duration:1500
          })
        },
        complete(){
          wx.hideLoading()
        }
      })
    }
  },
  async onLoad(){
    this.getgoodslist()
    console.log('index onLoad',this.globalData);
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // console.log('app created and cache logs by setStorageSync')
    
    let loginstate = await this.loginCheck()
    this.globalData.loginstate = loginstate
    if(loginstate.state !== true){
      // 弹窗强制授权
      console.log('woyao 弹窗强制授权');
      wx.showToast({
        title:"请先登录哦",
        icon:"none",
        mask:true,
        duration:12500,
        success(){
          setTimeout(function(){
            wx.switchTab({url:"/pages/my/main"})
          },1500)
        }
      })
    }else{
      this.globalData.userInfo = loginstate.userInfo
    }
    
  },
  async onShow() {
    wx.setTopBarText({
      text:'asdasd1asd1as1d3'
    })
    console.log('index show');
  //   console.log('appdata onShow',this.globalData);
    
  //   // 调用应用实例的方法获取全局数据
  //   // 检查定位授权
  //   let locationAuth = await checkscope("scope.userLocation"); //userInfo
  //   console.log(72, locationAuth);
  //   if (!locationAuth) {
  //     let locationAuthRes = await authorize("scope.userLocation");
  //     console.log(75, locationAuthRes);
  //     if (locationAuthRes.errMsg == "authorize:ok") {
  //       // 同意
  //       let location = await chooselocation();
  //       console.log(location);
  //     } else {
  //       // 拒绝了
  //       let modalres = await modal({
  //         content: "打开定位可以看到离你最近的批发商哦",
  //         cancelText: "放弃推荐",
  //         confirmText: "打开定位"
  //       });
  //       console.log(86, modalres);
  //       if (modalres) {
  //         // 打开设置页面
  //         let settingres = await openSetting();
  //         console.log(settingres);
  //         if (settingres["scope.userLocation"]) {
  //           // 已打开定位
  //           wx.showToast({
  //             title: "定位打开成功",
  //             icon: "none",
  //             duration: 1000
  //           });
  //           let location = await chooselocation();
  //           console.log(location);
  //         } else {
  //           wx.showToast({
  //             title: "您没有打开定位",
  //             icon: "none",
  //             duration: 1000
  //           });
  //         }
  //       }
  //     }
  //   } else {
  //     // let location = await chooselocation()
  //     // console.log(location);
  //   }
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
  justify-content: space-between;
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
}
.onbottom{
  background-color: #fff;
  text-align: center;
  font-size: 20rpx;
  color: #aaa;
}
</style>
