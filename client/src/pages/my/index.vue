<template>
  <div class="container">
    <!-- <open-data type="userAvatarUrl"></open-data>
    <open-data type="userNickName"></open-data>-->
    <div class="mainpart top">
      <div class="l">
        <img :src="userInfo.avatarUrl" alt="原始头像" mode="widthFix">
      </div>
      <div class="m1 m" v-if="!haslogin">
        <button class="loginbtn" open-type="getUserInfo" @getuserinfo="getUserInfo">立即登录</button>
      </div>
      <div class="m2 m" v-if="haslogin">
        <span>{{userInfo.nickName}}</span>
      </div>

      <div class="r"></div>
    </div>
    <div class="mainpart mid">
      <div class="head">
        <div class="myorder">我的订单</div>
        <div class="toall">查看全部<i class='iconfont icon-tubiao_xiangyou'></i></div>
      </div>
      <div class="list">
        <div>
          <i class='iconfont icon-fukuan'></i>
          <div>待付款</div>
        </div>
        <div>
          <i class='iconfont icon-icon-test'></i>
          <div>待发货</div>
        </div>
        <div>
          <i class='iconfont icon-yifahuodefuben'></i>
          <div>已发货</div>
        </div>
        <div>
          <i class='iconfont icon-yiwanchengdingdan'></i>
          <div>已完成</div>
        </div>
        <div>
          <i class='iconfont icon-tui'></i>
          <div>退换货</div>
        </div>
      </div>
    </div>
    <div class="mainpart btm">
      <div class="list">
        收货地址<i class='iconfont icon-tubiao_xiangyou'></i>
      </div>
      <div class="list">
        联系我们<i class='iconfont icon-tubiao_xiangyou'></i>
      </div>
      <div class="list">
        供应商入驻<i class='iconfont icon-tubiao_xiangyou'></i>
      </div>
      <div class="list">
        我的邀请<i class='iconfont icon-tubiao_xiangyou'></i>
      </div>
      <div class="list">
        联系我们<i class='iconfont icon-tubiao_xiangyou'></i>
      </div>
    </div>
    <!-- <mp-button open-type="getUserInfo" @getuserinfo="getUserInfo">123</mp-button> -->
  </div>
</template>
<script>
import mpButton from "mpvue-weui/src/button";
export default {
  components: {
    mpButton
  },
  data: function() {
    return {
      haslogin: false,
      userInfo: {
        avatarUrl: "/static/img/initialAvatar.png",
        city: "",
        country: "",
        gender: 1, //0：未知、1：男、2：女
        language: "zh_CN",
        nickName: "",
        province: ""
      }
    };
  },
  created() {
    //
    var self = this;
    console.log(this);

    // 授权检查
    wx.getSetting({
      success(res) {
        console.log(res.authSetting);
        // let
        if (res.authSetting["scope.userInfo"]) {
          // 已授权
          self.haslogin = true;
          wx.getUserInfo({
            success: res => {
              self.userInfo = res.userInfo;
              console.log(res);
            }
          });
        } else {
          // 未授权
        }
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    });
  },
  methods: {
    getUserInfo() {
      console.log(this);
      var self = this;
      console.log("getuserinfo");
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              self.haslogin = true;

              self.userInfo = res.userInfo;
              console.log(res);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$maincolor: #ce4031;
.container {
  background-color: rgb(233, 233, 233);
  .mainpart {
    padding: 20rpx;
    background-color: #fff;
    margin-bottom: 12rpx;
  }
  .top {
    display: flex;

    .l {
      // width: 128rpx;
      padding-left: 20rpx;
      img {
        width: 128rpx;
        height: 128rpx;
        float: left;
        border: 1px solid rgb(233, 233, 233);
        border-radius: 64rpx;
      }
    }
    .m {
      display: flex;
      //   background-color: pink;
      padding-left: 40rpx;
      //   flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .loginbtn {
        background-color: $maincolor;
        color: #fff;
      }
    }
    .r {
      background: #ce4031;
    }
  }
  .mid{
    .head{
      display: flex;
      flex-direction: row;
      justify-content: space-between ;
      .myorder{
        font-family: Courier, monospace;
        font-size: 36rpx;
        
      }
      .toall{
        display: flex;
        flex-direction: row;
        align-items:center;
        color: rgb(156,156,156);
        font-size: 32rpx;
      }
    }
    .list{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      &>div{
        text-align: center;
        i{
          font-size: 75rpx;
          // color: rgb(166,166,166);
          color:  $maincolor;
        }
        div{
          font-size: 32rpx;
          color: rgb(89,89,89)
        }
      }
    }
  }
  .btm{
    .list{  
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 75rpx;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
    }

  }
}
</style>
