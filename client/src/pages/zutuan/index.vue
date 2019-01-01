<template>
  <div class="container">
    <div class="location">
      <i class="iconfont icon-round"></i>
      <span @click="chooselocation">{{location}}</span>
      <i class="iconfont icon-tubiao_xiala"></i>
      <button @click="opensetting" v-if="showopensettingbtn">打开定位</button>
    </div>
    <i-tabs :current="current" color="#ce4031" @change="handleChange">
      <i-tab key="tab1" title="附近帮主"></i-tab>
      <i-tab key="tab2" title="附近用户"></i-tab>
    </i-tabs>
    <div class="tab1con tabcon" v-if="current == 'tab1'">
      <div class="mapcon">
        <!-- <map
          id="map1"
          v-if="map1.mapshow"
          name
          :longitude="map1.longitude"
          :latitude="map1.latitude"
          :scale="map1.scale"
          :markers="map1.markers"
          :circles="map1.circles"
          @markertap="markertap"
          enable-zoom="true"
          enable-scroll="true"
        ></map> -->
      </div>
      <div>
        <i-card
          v-for='(x,i) in bangzhulist'
          :key="i"
          full
          :title="x.userinfo.nickName"
          extra="看看他的发布"
          :thumb="x.userinfo.avatarUrl"
          @click='tosearchgoods(x.openid)'
        >
          <view slot="content">他发布了{{x.goodslist.length}}个商品</view>
          <view slot="footer">
            <span class="iconfont icon-round"></span>
            {{x.citylabel2}}
          </view>
        </i-card>
      </div>
    </div>

    <div class="tab2con tabcon" v-if="current == 'tab2'">
      <div class="mapcon">
        <!-- <map
          id="map2"
          v-if="map2.mapshow"
          name
          :longitude="map2.longitude"
          :latitude="map2.latitude"
          :scale="map2.scale"
          :markers="map2.markers"
          :circles="map2.circles"
          @markertap="markertap"
          enable-zoom="true"
          enable-scroll="true"
        ></map> -->
      </div>
      <div>
        <i-card
          full
          title="卡片标题"
          extra="额外内容"
          thumb="https://i.loli.net/2017/08/21/599a521472424.jpg"
        >
          <view slot="content">内容不错</view>
          <view slot="footer">尾部内容</view>
        </i-card>
      </div>
    </div>
    <div class="fabu">
      <button hover-class="btnhover" @click="togoodsupload">我要发布</button>
    </div>
  </div>
</template>
<script>
import qqmap from "@/wxapis/qqmap.js";
// var qqmap = require('@/wxapis/qqmap.js');
var mymap = new qqmap({
  // 地图开发秘钥
  key: "HOOBZ-FGYRX-3SC4H-ZDMLM-6ZJG6-V7BJD" // 必填
});
import qc from 'wafer2-client-sdk'
import conf from '@/config'
import checkscope from "@/wxapis/check_scope";
import authorize from "@/wxapis/authorize";
import openSetting from "@/wxapis/openSetting";
import chooselocation from "@/wxapis/chooselocation";
import modal from "@/wxapis/modal";

export default {
  data: function() {
    return {
      // routeInfo: routeInfo
      current: "tab1",
      location: "点击切换定位",
      mypositioncode: "",
      bangzhulist:[],
      map1: {
        mapshow: true,
        showopensettingbtn: true,
        longitude: "longitude",
        latitude: "latitude",
        scale: 17,
        markers: [],
        circles: [],
        controls: [
          {
            position: {
              left: 0,
              top: 0,
              width: 32,
              height: 32
            },
            iconPath: "/static/img/initialAvatar.png"
          }
        ]
      },
      map2: {
        mapshow: true,
        showopensettingbtn: false,
        longitude: "longitude",
        latitude: "latitude",
        scale: 17,
        markers: [],
        circles: [],
        controls: [
          {
            position: {
              left: 0,
              top: 0,
              width: 32,
              height: 32
            },
            iconPath: "/static/img/initialAvatar.png"
          }
        ]
      }
    };
  },
  methods: {
    async chooselocation() {
      try {
        let location = (await chooselocation()) || null;
        this.location = location.name || "切换位置";
        console.log(location);
        let querycode = await this.reverseGeocoder(
          location.longitude,
          location.latitude
        );
        console.log("querycode:", querycode);
        this.mypositioncode = querycode.result.ad_info.adcode;
        console.log("this.mypositioncode:", this.mypositioncode);
        this.searchbangzhu()
        this.map1.longitude = location.longitude;
        this.map1.latitude = location.latitude;
        this.map2.longitude = location.longitude;
        this.map2.latitude = location.latitude;
        console.log(location.latitude, location.longitude);
        // {
        //   latitude: 31.24924,
        //   longitude: 120.68966,
        //   radius: 500,
        //   color : "#ff0000ff",
        //   fillColor	: "#60caf566",
        // }
        this.map1.circles = [
          {
            latitude: location.latitude,
            longitude: location.longitude,
            radius: 500,
            color: "#ff0000ff",
            fillColor: "#60caf566"
          }
        ];
        this.map2.circles = [
          {
            latitude: location.latitude,
            longitude: location.longitude,
            radius: 500,
            color: "#ff0000ff",
            fillColor: "#60caf566"
          }
        ];
        this.map1.markers = [
          {
            id: "myself",
            latitude: location.latitude,
            longitude: location.longitude
          }
        ];
        this.map2.markers = [
          {
            id: "myself",
            latitude: location.latitude,
            longitude: location.longitude
          }
        ];
        console.log(this.map1, this.map2);

        wx.setStorageSync("zutuanposition", location);
      } catch (error) {
        wx.showToast({
          title: error,
          duration: 1500,
          icon: "none"
        });
      }
    },
    async changelocation() {
      // 检查定位授权
      let locationAuth = await checkscope("scope.userLocation"); //userInfo
      console.log(46, locationAuth);
      if (!locationAuth) {
        console.log("未授权过，唤起授权窗口");
        let locationAuthRes = await authorize("scope.userLocation");
        console.log(49, locationAuthRes);
        if (locationAuthRes.errMsg == "authorize:ok") {
          console.log("同意授权");
          this.showopensettingbtn = false;
          // 同意
          let location = (await chooselocation()) || null;
          let querycode = await this.reverseGeocoder(
            location.longitude,
            location.latitude
          );
          console.log("querycode:", querycode);
          this.mypositioncode = querycode.result.ad_info.adcode;
          console.log("this.mypositioncode:", this.mypositioncode);
          this.searchbangzhu()
          this.location = location.name || "切换位置";
          console.log(location);
          this.map1.longitude = location.longitude;
          this.map1.latitude = location.latitude;
          this.map2.longitude = location.longitude;
          this.map2.latitude = location.latitude;
          this.map1.circles = [
            {
              latitude: location.latitude,
              longitude: location.longitude,
              radius: 500,
              color: "#ff0000ff",
              fillColor: "#60caf566"
            }
          ];
          this.map2.circles = [
            {
              latitude: location.latitude,
              longitude: location.longitude,
              radius: 500,
              color: "#ff0000ff",
              fillColor: "#60caf566"
            }
          ];
          this.map1.markers = [
            {
              id: "myself",
              latitude: location.latitude,
              longitude: location.longitude
            }
          ];
          this.map2.markers = [
            {
              id: "myself",
              latitude: location.latitude,
              longitude: location.longitude
            }
          ];
          wx.setStorageSync("zutuanposition", location);
        } else {
          console.log("拒绝授权");
          // 拒绝过
          this.showopensettingbtn = true;
          let modalres = await modal({
            content: "请点击'打开定位'按钮，即可看到离你最近的组团商品",
            // cancelText: "放弃组团",
            confirmText: "好"
          });
          console.log(65, modalres);
          if (modalres) {
            // 需要用户打开设置 开启定位
          }
        }
      } else {
        this.showopensettingbtn = false;
        console.log("已授权");
      }
    },
    async opensetting() {
      // 打开设置页面
      let settingres = await openSetting();
      console.log(settingres);
      if (settingres["scope.userLocation"]) {
        this.showopensettingbtn = false;
        // 已打开定位
        wx.showToast({
          title: "定位打开成功",
          icon: "none",
          duration: 1000
        });
      } else {
        this.showopensettingbtn = true;
        wx.showToast({
          title: "您没有打开定位",
          icon: "none",
          duration: 1000
        });
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
    searchbangzhu(){
      let self = this
      qc.request({
        url: conf.service.searchbangzhuUrl ,
        data: {
          code: self.mypositioncode
        },
        success(res){
          console.log(res);
          self.bangzhulist = res.data.data
        },
        fail(err){
          console.log(err);
          self.bangzhulist = []
        }
      })
    },
    tosearchgoods(openid){
      wx.navigateTo({
        url:`/pages/bangzhugoods/main?openid=${openid}`
      })
    },
    searchgoods(openid){
      let self = this
      if( !openid ){
        return wx.showToast({
          title:'没有发布商品',
          icon:'none',
          duration: 1500
        })
      }
      qc.request({
        url: conf.service.searchbangzhugoodsUrl ,
        data: {
          openid: openid
        },
        success(res){
          console.log(res);
        },
        fail(err){
          console.log(err);
        }
      })
    },
    handleChange(x) {
      console.log(x);
      this.current = x.mp.detail.key;
    },
    togoodsupload() {
      wx.navigateTo({
        url: "/pages/goodsupload/main"
      });
    }
  },
  async onLoad() {
    console.log("onload");
    wx.showShareMenu({
      withShareTicket: true
    });
    // 获取storage中存出的地址
    let zutuanposition = wx.getStorageSync("zutuanposition") || null;
    console.log(zutuanposition);
    // if(!zutuanposition){
    //   this.changelocation()
    // }
    if (zutuanposition && zutuanposition.name) {
      this.location = zutuanposition.name || "点击切换定位";

      let querycode = await this.reverseGeocoder(
        zutuanposition.longitude,
        zutuanposition.latitude
      );
      console.log("querycode:", querycode);
      this.mypositioncode = querycode.result.ad_info.adcode;
      console.log("this.mypositioncode:", this.mypositioncode);
      this.searchbangzhu()
      this.map1.longitude = zutuanposition.longitude;
      this.map1.latitude = zutuanposition.latitude;
      this.map2.longitude = zutuanposition.longitude;
      this.map2.latitude = zutuanposition.latitude;
      this.map1.circles = [
        {
          latitude: zutuanposition.latitude,
          longitude: zutuanposition.longitude,
          radius: 500,
          color: "#ff0000ff",
          fillColor: "#60caf566"
        }
      ];
      this.map2.circles = [
        {
          latitude: zutuanposition.latitude,
          longitude: zutuanposition.longitude,
          radius: 500,
          color: "#ff0000ff",
          fillColor: "#60caf566"
        }
      ];
      this.map1.markers = [
        {
          id: "myself",
          latitude: zutuanposition.latitude,
          longitude: zutuanposition.longitude
        }
      ];
      this.map2.markers = [
        {
          id: "myself",
          latitude: zutuanposition.latitude,
          longitude: zutuanposition.longitude
        }
      ];
      console.log(this.map1, this.map2);
    } else {
      this.location = "点击切换定位";
    }
  },
  onShow() {
    if (!this.globalData.loginstate) {
      wx.showToast({
        title: "请先登录哦",
        icon: "none",
        mask: true,
        duration: 1500,
        success() {
          setTimeout(function() {
            wx.switchTab({ url: "/pages/my/main" });
          }, 1500);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$maincolor: #ce4031;
.location {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20rpx;
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
  button {
    background-color: $maincolor;
    height: 55rpx;
    line-height: 55rpx;
    color: #fff;
  }
}

.tabcon {
  map {
    width: 750rpx;
    height: 750rpx;
  }
}

.fabu {
  width: 750rpx;
  position: fixed;
  bottom: 0;
  button {
    width: 40%;
    height: 62rpx;
    line-height: 62rpx;
    background-color: $maincolor;
    font-size: 32rpx;
    border-radius: 31rpx;
    color: #fff;
  }
  .btnhover {
    background-color: rgb(138, 0, 0);
  }
}
</style>
