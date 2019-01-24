<template>
  <!-- @click="clickHandle('test click', $event)" -->
  <div class="container">
    <slogan type='index'></slogan>
    <!-- 打开授权设置页面 -->
    <!-- <mp-button @click='opensetting'>opensetting</mp-button> -->
    <div class="location" @click="changelocation" v-if='!locationauthed'>
      <i class="iconfont icon-round"></i>
      <span>{{location}}</span>
      <i class="iconfont icon-tubiao_xiala"></i>
    </div>
    <swiper indicator-dots="true" autoplay="true" interval="2500" duration="500" circular="true"
     @click='loadswiper'>
      <block v-for="(x, i) in swiperlist" :key="i">
        <swiper-item>
          <img :src="x.url" class="slide-image" mode="widthFix">
        </swiper-item>
      </block>
    </swiper>
    <div class="join">
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
    <i-divider :content="divider"></i-divider>
    <auth-modal :show="authmodalshow"></auth-modal>
  </div>
</template>

<script>
import qc from 'wafer2-client-sdk'
import conf from '@/config'
import qqmap from "@/wxapis/qqmap.js";
var mymap = new qqmap({
  // 地图开发秘钥
  key: conf.mapkey // 必填
});

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
      location: "点击切换城市",
      swiperlist: [],
      goodslist: [],
      mycity:'',
      locationauthed:false,
      divider:'已经到底啦'
    };
  },
  components: {
    slogan,
    mpButton,
    goodsItem,authModal
  },
  methods: {
    loadswiper(){
      if(this.swiperlist.length == 0){
        this.getswiperlist()
      }
    },
    async changelocation() {
      var self = this
      // 检查定位授权
      let locationAuth = await checkscope("scope.userLocation"); //userInfo
      // console.log(66, locationAuth);
      if (!locationAuth) {
        let locationAuthRes = await authorize("scope.userLocation");
        // console.log(75, locationAuthRes);
        if (locationAuthRes.errMsg == "authorize:ok") {
          self.locationauthed = true
          // 同意
          // let location = await chooselocation() || {};
          // this.location = location.name || '切换位置';
          // console.log(location);
          wx.getLocation({
            type:'gcj02', // wgs84
            async success(res){
              console.log(res);
              let querycode = await self.reverseGeocoder(
                res.longitude,
                res.latitude
              );
              console.log(querycode);
              self.location = querycode.result.address_component.city
              wx.setStorageSync('mycity', querycode.result.address_component.city)
            },
            fail(){
              wx.showToast({
                title:"位置获取失败，请检查网络",
                duration: 1800,
                icon:'none'
              })
            }
          })
        } else {
          // 拒绝了
          self.locationauthed = false
          let modalres = await modal({
            content: "通过点击右上角->关于->右上角->设置->使用我的位置可重新打开定位",
            cancelText: "放弃推荐",
            confirmText: "我知道了"
          });
          // console.log(86, modalres);
          if (modalres) {
            // 打开设置页面
            let settingres = await openSetting();
            // console.log(settingres);
            if (settingres["scope.userLocation"]) {
              self.locationauthed = true
              // 已打开定位
              wx.showToast({
                title: "定位打开成功",
                icon: "none",
                duration: 1000
              });
              // let location = await chooselocation() || {};
              // this.location = location.name || '切换位置';
              // console.log(location);
              wx.getLocation({
                type:'gcj02', // wgs84
                async success(res){
                  console.log(res);
                  let querycode = await self.reverseGeocoder(
                    res.longitude,
                    res.latitude
                  );
                  console.log(querycode);
                  self.location = querycode.result.address_component.city
                  wx.setStorageSync('mycity', querycode.result.address_component.city)
                },
                fail(){
                  wx.showToast({
                    title:"位置获取失败，请检查网络",
                    duration: 1800,
                    icon:'none'
                  })
                }
              })
            } else {
              self.locationauthed = false
              wx.showToast({
                title: "您没有打开定位",
                icon: "none",
                duration: 1000
              });
            }
          }
          self.location = '全国'
          self.locationauthed = true
          wx.setStorageSync('mycity','全国')

        }
      } else {
        self.locationauthed = true
        // let location = await chooselocation() || {};
        // this.location = location.name || '切换位置';
        // console.log(location);
        wx.getLocation({
          type:'gcj02', // wgs84
          async success(res){
            console.log(res);
            let querycode = await self.reverseGeocoder(
              res.longitude,
              res.latitude
            );
            console.log(querycode);
            self.location = querycode.result.address_component.city
            wx.setStorageSync('mycity', querycode.result.address_component.city)
          },
          fail(){
            wx.showToast({
              title:"位置获取失败，请检查网络",
              duration: 1800,
              icon:'none'
            })
          }
        })
      }
    },
    reverseGeocoder(longitude, latitude) {
      return new Promise(function(resolve, reject) {
        mymap.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            resolve(res);
          },
          fail: function(res) {
            resolve(null);
          }
        });
      });
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
      let url = `/pages/my/main`
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
          if( self.location && self.location != '点击切换城市' ){
            let data = res.data.data
            let list = []
            for(let i=0;i<data.length-1;i++){
              if(!data[i].targetArea_name){
                list.push( data[i] )
                continue
              }
              data[i].targetArea_name = JSON.parse(data[i].targetArea_name) || []
              data[i].targetArea_name.map(function(v1,i1){
                if(v1.name == self.location|| v1.name =='全国' || !v1.name ){
                  list.push( data[i] )
                  return
                }
              })
            }
            self.goodslist = list
            self.divider = `以上推荐的是${self.location}的商品`
          }else{
            self.goodslist = res.data.data
          }
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
  },
  onShow() {
    // console.log('index show');
    if(!this.globalData.loginstate){
      return wx.showToast({
        title:"请先登录哦",
        icon:"none",
        mask:true,
        duration:1500,
        success(){
          setTimeout(function(){
            wx.switchTab({url:"/pages/my/main"})
          },1600)
        }
      })
    }
    let mycity = wx.getStorageSync('mycity')
    if(!mycity){
      this.location = '点击切换城市';
    }else{
      this.location = mycity
    }
    this.changelocation()
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
  font-size: 30rpx;
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
    width: 100rpx;
    height: 100rpx;
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
  }
  .gysrz{
    text-align: center;
  }
}
.onbottom{
  background-color: #fff;
  text-align: center;
  font-size: 20rpx;
  color: #aaa;
}
</style>
