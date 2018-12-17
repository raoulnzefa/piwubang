<template>
  <!-- @click="clickHandle('test click', $event)" -->
  <div class="container">
    <slogan></slogan>

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
      <button class="joinbtn" hover-class="joinbtnhover">帮主招募</button>
      <button class="joinbtn" hover-class="joinbtnhover">供应商入驻</button>
      <button class="joinbtn" hover-class="joinbtnhover">加入帮派</button>
    </div>
    <div class="dailygoods">
      <goods-item v-for="(x,k) in goodslist" :key="k" :goodsinfo="x"></goods-item>
    </div>
  </div>
</template>

<script>
import checkscope from "@/wxapis/check_scope";
import authorize from "@/wxapis/authorize";
import openSetting from "@/wxapis/openSetting";
import chooselocation from "@/wxapis/chooselocation";
import modal from "@/wxapis/modal";

import slogan from "@/components/slogan";
import goodsItem from "@/components/goodsitem";

import mpButton from "mpvue-weui/src/button";

export default {
  data() {
    return {
      motto: "Hello World",
      userInfo: {},
      location: "尚未获取定位",
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
      goodslist: [
        {
          _id: "asd13as1d",
          name: "智利车厘子",
          briefDesc: "智利车厘子",
          soldCount: "125",
          currentPrice: "32",
          oldPrice: "59",
          urls: [
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/yingtao1.png",
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E6%A8%B1%E6%A1%832.png"
          ]
        },{
          _id: "asd13wq89",
          name: "新西兰奇异果",
          briefDesc: "新西兰奇异果新西兰奇异果新西兰奇异果",
          soldCount: "323",
          currentPrice: "6.6",
          oldPrice: "12.3",
          urls: [
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E7%8C%95%E7%8C%B4%E6%A1%831.png",
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E7%8C%95%E7%8C%B4%E6%A1%832.png"
          ]
        },{
          _id: "asd13as1d",
          name: "智利车厘子",
          briefDesc: "智利车厘子",
          soldCount: "125",
          currentPrice: "32",
          oldPrice: "59",
          urls: [
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/yingtao1.png",
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E6%A8%B1%E6%A1%832.png"
          ]
        },{
          _id: "asd13wq89",
          name: "新西兰奇异果",
          briefDesc: "新西兰奇异果新西兰奇异果新西兰奇异果",
          soldCount: "323",
          currentPrice: "6.6",
          oldPrice: "12.3",
          urls: [
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E7%8C%95%E7%8C%B4%E6%A1%831.png",
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E7%8C%95%E7%8C%B4%E6%A1%832.png"
          ]
        },{
          _id: "asd13as1d",
          name: "智利车厘子",
          briefDesc: "智利车厘子",
          soldCount: "125",
          currentPrice: "32",
          oldPrice: "59",
          urls: [
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/yingtao1.png",
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E6%A8%B1%E6%A1%832.png"
          ]
        },{
          _id: "asd13wq89",
          name: "新西兰奇异果",
          briefDesc: "新西兰奇异果新西兰奇异果新西兰奇异果",
          soldCount: "323",
          currentPrice: "6.6",
          oldPrice: "12.3",
          urls: [
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E7%8C%95%E7%8C%B4%E6%A1%831.png",
            "https://piwubang-1257779595.cos.ap-shanghai.myqcloud.com/testupload/%E7%8C%95%E7%8C%B4%E6%A1%832.png"
          ]
        }
      ]
    };
  },
  components: {
    slogan,
    mpButton,
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
    }
  },

  async created() {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
    // 检查定位授权
    let locationAuth = await checkscope("scope.userLocation"); //userInfo
    console.log(72, locationAuth);
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
      // let location = await chooselocation()
      // console.log(location);
    }
  }
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
</style>
