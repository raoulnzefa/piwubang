<template>
  <!-- @click="clickHandle('test click', $event)" -->
  <div class="container">
    <div class="shop platformshop" v-if="platform.length > 0">
      <div class="shopheader">
        <div>
          <span class="iconfont icon-tubiao_shangcheng"></span>
          平台好物
        </div>
      </div>
      <checkbox-group @change="selectgoods($event,'platform','platform')">
        <div class="main" v-for="(x,i) in platform" :key="i">
          <div class="header">
            <!-- <div class="u">商品详情</div> -->
            <div class="m">
              <div class="selectgoods">
                <checkbox color="#ce4031" :value="x.goodsid" :checked="x.checked"/>
              </div>
              <div class="l" @click="todetail(x)">
                <img :src="x.thumbnail" mode="widthFix" alt>
              </div>
              <div class="m" @click="todetail(x)">
                <div>{{x.name}}</div>
                <div class="desc">{{x.desc}}</div>
              </div>
              <div class="r">
                <div class="u">￥{{x.currentPrice}}</div>
                <div class="b">
                  <button @click="platform[i].count--" :disabled="x.count<=1">-</button>
                  <input type="text" v-model.lazy="x.count" disabled>
                  <button @click="platform[i].count++">+</button>
                </div>
              </div>
            </div>
          </div>
          <div class="fahuo">
            <span class="iconfont icon-zhuyi"></span>
            <span class="tips" v-if="x.deliveryMethods">【{{x.deliveryMethods}}】</span>
            <span class="tips" v-if="x.shipping">【{{x.shipping}}】</span>
          </div>
          <div class="fahuo" v-if="false">
            <!-- <div class="u">注意事项</div> -->
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
        </div>
      </checkbox-group>
    </div>
    <div class="shop bangzhushop" v-for="(y,k) in bangzhu" :key="k">
      <div class="shopheader">
        <div>
          <span class="iconfont icon-tubiao_shangcheng"></span>
          帮主推荐
        </div>
      </div>
      <checkbox-group @change="selectgoods($event,'bangzhu')">
        <div class="main" v-for="(m,j) in bangzhu[k]" :key="j">
          <div class="header">
            <!-- <div class="u">商品详情</div> -->
            <div class="m">
              <div class="selectgoods">
                <checkbox color="#ce4031" :value="m.goodsid" :checked="m.checked"/>
              </div>
              <div class="l" @click="todetail(x)">
                <img :src="m.thumbnail" mode="widthFix" alt>
              </div>
              <div class="m" @click="todetail(x)">
                <div>{{m.name}}</div>
                <div class="desc">{{m.desc}}</div>
              </div>
              <div class="r">
                <div class="u">￥{{m.currentPrice}}</div>
                <div class="b">
                  <!-- <button @click="minus('bangzhu',k,j)" :disabled="m.count<=1">-</button>
                  <input type="text" v-model.lazy="m.count" disabled>
                  <button @click="plus('bangzhu',k,j)">+</button> -->
                  <button @click="bangzhu[k][j].count--" :disabled="m.count<=1">-</button>
                  <input type="text" v-model.lazy="m.count" disabled>
                  <button @click="bangzhu[k][j].count++">+</button>
                </div>
              </div>
            </div>
          </div>
          <div class="fahuo">
            <span class="iconfont icon-zhuyi"></span>
            <span class="tips" v-if="m.deliveryMethods">【{{m.deliveryMethods}}】</span>
            <span class="tips" v-if="m.shipping">【{{m.shipping}}】</span>
          </div>
          <!-- <div class="jiesuan">
          <button class='pay' hover-class='btnhover' @click='buy(x)'>结算</button>
          </div>-->
        </div>
      </checkbox-group>
    </div>
    <div class="shop usershop" v-for="(y,k) in user" :key="k">
      <div class="shopheader">
        <div>
          <span class="iconfont icon-tubiao_shangcheng"></span>
          个人卖家
        </div>
      </div>
      <checkbox-group @change="selectgoods($event,'user')">
        <div class="main" v-for="(x,i) in y" :key="i">
          <div class="header">
            <!-- <div class="u">商品详情</div> -->
            <div class="m">
              <div class="selectgoods">
                <checkbox color="#ce4031" :value="x.goodsid" :checked="x.checked"/>
              </div>
              <div class="l" @click="todetail(x)">
                <img :src="x.thumbnail" mode="widthFix" alt>
              </div>
              <div class="m" @click="todetail(x)">
                <div>{{x.name}}</div>
                <div class="desc">{{x.desc}}</div>
              </div>
              <div class="r">
                <div class="u">￥{{x.currentPrice}}</div>
                <div class="b">
                  <button @click="minus('user',k,i)" :disabled="x.count<=1">-</button>
                  <input type="text" v-model.lazy="x.count" disabled>
                  <button @click="plus('user',k,i)">+</button>
                </div>
              </div>
            </div>
          </div>
          <div class="fahuo">
            <span class="iconfont icon-zhuyi"></span>
            <span class="tips" v-if="x.deliveryMethods">【{{x.deliveryMethods}}】</span>
            <span class="tips" v-if="x.shipping">【{{x.shipping}}】</span>
          </div>
          <!-- <div class="jiesuan">
          <button class='pay' hover-class='btnhover' @click='buy(x)'>结算</button>
          </div>-->
        </div>
      </checkbox-group>
    </div>
    <div class="jiesuan">
      <span class="total">总价：￥{{total}}</span>
      <button hover-class="btnhover" @click="buy">结算</button>
    </div>
    <!-- <i-divider content="已经到底啦" v-if="!shownone"></i-divider> -->
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

import qc from "wafer2-client-sdk";
import conf from "@/config";

import slogan from "@/components/slogan";
import goodsItem from "@/components/goodsitem";

export default {
  data() {
    return {
      cartgoods: {
        platform: [],
        bangzhu: {},
        user: {}
      },
      platform: [],
      bangzhu: {},
      user: {},
      shownone: false,
      userInfo: {},
      location: "尚未获取定位",
      img: "",
      goodsid: "",
      count: 1,
      a: {},
      total: 0,
      selectedlist: {
        origin: null,
        uploadUser: null,
        goods: []
      }
    };
  },
  components: {
    slogan,
    goodsItem
  },
  computed: {},
  methods: {
    aa() {
      this.a = {
        count: 1
      };
    },
    minus(type, index, index1 = null) {
      if (type == "platform") {
        // let count = this.cartgoods['platform'][index].count
        let count = this.platform[index].count;

        count > 1 ? (count -= 1) : "";
        // this.$set(this.cartgoods['platform'][index],'count',count)
        this.$set(this.platform[index], "count", count);
      } else if (type == "bangzhu") {
        let count = this.bangzhu[index][index1].count;
        count > 1 ? (count -= 1) : "";
        this.$set(this.bangzhu[index][index1], "count", count);
      } else if (type == "user") {
        let count = this.user[index][index1].count;
        count > 1 ? (count -= 1) : "";
        this.$set(this.user[index][index1], "count", count);
      }
      // console.log(this.cartgoods);
    },
    plus(type, index, index1 = null) {
      if (type == "platform") {
        // let count = this.cartgoods['platform'][index].count
        let count = this.platform[index].count;
        count += 1;
        // this.$set(this.cartgoods['platform'][index],'count',count)
        this.$set(this.platform[index], "count", count);
      } else if (type == "bangzhu") {
        let count = this.bangzhu[index][index1].count;
        count += 1;
        this.$set(this.bangzhu[index][index1], "count", count);
      } else if (type == "user") {
        let count = this.user[index][index1].count;
        count += 1;
        this.$set(this.user[index][index1], "count", count);
      }
      console.log(this.bangzhu);
    },
    selectgoods(e, origin, uploadUser, goodsitem) {
      var self = this;
      console.log(uploadUser, goodsitem);
      console.log(e);
      // 操作 selectedlist 只允许有一个来源 platform || bangzhu || user
      // selectedlist:{
      //   origin: null,
      //   uploadUser: null,
      //   goods:[]
      // }
      let arr = e.mp.detail.value;
      // if (arr.length != 0) {
      //   self.selectedlist.goods = [];
      //   arr.map(function(v, i) {
      //     self.selectedlist.goods[i] = {};
      //     self.selectedlist.goods[i]._id = v;
      //     self.selectedlist.goods[i].count = v.count;
      //   });
      //   self.selectedlist.origin = origin;
      //   self.selectedlist.uploadUser = uploadUser;
      // } else {
      // }
      console.log(self.selectedlist);
    },
    async buy(x) {
      wx.showLoading({
        title: "Loading..."
      });
      // 统一下单 生成订单号
      // qcloud.request  https://github.com/tencentyun/wafer-client-sdk#request
      qc.request({
        // login:true,
        url: conf.service.prepayUrl,
        // method:"POST",
        data: {
          count: x.count,
          _id: x.goodsid
        },
        success: async function(res) {
          wx.hideLoading();
          console.log("统一下单返回：");
          console.log(res.data);
          if (res.data.code == 1 && res.data.success) {
            console.log("支付中");
            let payres = await wxpay(res.data.data);
            console.log("payres", payres);
            console.log("支付流程结束，支付成功~");
            if (payres.errMsg == "requestPayment:ok") {
              // 前端订单支付完成 等待商家核验（等待微信通知回调）
              let clientpaidres = await clientpaid(res.data.data);
              console.log("前端订单支付完成 等待商家核验");

              wx.showToast({
                title: clientpaidres.msg,
                duration: 1500,
                icon: "success",
                mask: true,
                complete: function() {
                  setTimeout(function() {
                    wx.navigateTo({
                      url: "/pages/orderlist/main?index=0"
                    });
                  }, 1500);
                }
              });
            } else {
              wx.showToast({
                title: "支付失败",
                duration: 1000,
                icon: "none",
                mask: true,
                complete: function() {
                  wx.navigateTo({
                    url: "/pages/orderlist/main?index=0"
                  });
                }
              });
            }
          } else {
            wx.showToast({
              title: res.data.data.reason,
              icon: "none",
              duration: 2000,
              complete: function() {
                wx.navigateBack({
                  delta: 1
                });
              }
            });
          }
        },
        fail: function(err) {
          console.log(err);
          console.log("支付流程结束，支付失败~");
          // wx.hideLoading();
          wx.showToast({
            title: "支付失败,请检查网络",
            duration: 1500,
            icon: "none",
            mask: true,
            complete: function() {
              // setTimeout(function(){
              //   wx.switchTab({
              //     url:"/pages/my/main"
              //   })
              // }, 1500)
            }
          });
        },
        complete: function() {
          // wx.hideLoading();
        }
      });
    },
    async paynow() {
      wx.showLoading({
        title: "Loading..."
      });
      // 统一下单 生成订单号
      // qcloud.request  https://github.com/tencentyun/wafer-client-sdk#request
      qc.request({
        // login:true,
        url: conf.service.prepayUrl,
        // method:"POST",
        data: {
          count: this.count,
          _id: this.goodsdetail._id
        },
        success: async function(res) {
          wx.hideLoading();
          console.log("统一下单返回：");
          console.log(res.data);
          if (res.data.code == 1 && res.data.success) {
            console.log("支付中");
            let payres = await wxpay(res.data.data);
            console.log("payres", payres);
            console.log("支付流程结束，支付成功~");
            if (payres.errMsg == "requestPayment:ok") {
              // 前端订单支付完成 等待商家核验（等待微信通知回调）
              let clientpaidres = await clientpaid(res.data.data);
              console.log("前端订单支付完成 等待商家核验");

              wx.showToast({
                title: clientpaidres.msg,
                duration: 1500,
                icon: "success",
                mask: true,
                complete: function() {
                  setTimeout(function() {
                    wx.navigateTo({
                      url: "/pages/orderlist/main?index=0"
                    });
                  }, 1500);
                }
              });
            } else {
              wx.showToast({
                title: "支付失败",
                duration: 1000,
                icon: "none",
                mask: true,
                complete: function() {
                  wx.navigateTo({
                    url: "/pages/orderlist/main?index=0"
                  });
                }
              });
            }
          } else {
            wx.showToast({
              title: res.data.data.reason,
              icon: "none",
              duration: 2000,
              complete: function() {
                wx.navigateBack({
                  delta: 1
                });
              }
            });
          }
        },
        fail: function(err) {
          console.log(err);
          console.log("支付流程结束，支付失败~");
          // wx.hideLoading();
          wx.showToast({
            title: "下单失败,请先登录",
            duration: 1000,
            icon: "none",
            mask: true,
            complete: function() {
              wx.switchTab({
                url: "/pages/my/main"
              });
            }
          });
        },
        complete: function() {
          // wx.hideLoading();
        }
      });
    },
    getcartgoods() {
      var self = this;
      wx.showLoading({
        title: "购物车读取中..."
      });
      qc.request({
        // login:true,
        url: conf.service.cartgoodsUrl,
        // method:"GET",
        data: {},
        success: function(res) {
          self.cartgoods = res.data.data
          self.platform = res.data.data.platform
          self.bangzhu = res.data.data.bangzhu
          console.log('bangzhu:');
          console.log(self.bangzhu);
          
          self.user = res.data.data.user;
          if (res.data.success) {
            if (
              res.data.data.platform == [] &&
              res.data.data.bangzhu == {} &&
              res.data.data.user == {}
            ) {
              self.shownone = true;
            } else {
              self.shownone = false;
            }
          } else {
            self.shownone = true;
            wx.removeTabBarBadge({
              index: 3
            });
          }
        },
        fail: function(err) {
          console.log(err);
          // wx.removeTabBarBadge({
          //   index : 3
          // })
          wx.showToast({
            title: "请求失败，请检查网络",
            icon: "none",
            duration: 2000
          });
        },
        complete: function() {
          console.log("456456456456456");

          wx.stopPullDownRefresh();
          wx.hideLoading();
        }
      });
    },
    todetail(x) {
      if (x.goodsid) {
        wx.navigateTo({
          url: `/pages/goodsdetail/main?goodsid=${x.goodsid}&origin=${x.origin}`
        });
      }
    }
  },
  onShow() {
    if (!this.globalData.loginstate) {
      return wx.showToast({
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
    this.getcartgoods();
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onPullDownRefresh() {
    this.getcartgoods();
  }
};
</script>

<style scoped lang='scss'>
$maincolor: #ce4031;
.icon-zhuyi {
  color: orange;
}
.container {
  background-color: #f3f3f3;
  padding: 20rpx 0rpx 70rpx;
}
.main {
  // border-top: 20rpx solid #f5f5f5 ;
  padding: 0 20rpx 10rpx;
  .u {
    color: #b3b3b3;
    font-size: 32rpx;
    // font-size: 13pt;
    border-bottom: 1px solid #f5f5f5;
  }
}
.shop {
  width: 710rpx;
  margin: 0 auto 20rpx;
  border-radius: 20rpx;
  background-color: #fff;
  padding: 20rpx 20rpx 10rpx;
  box-sizing: border-box;
  .shopheader {
    color: #000;
    font-size: 30rpx;
    padding: 0rpx 10rpx 0rpx;
    border-bottom: 1rpx solid #f5f5f5;
  }
}

.header {
  & > .m {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 10rpx 0 0;
    // border-bottom: 1px solid #f5f5f5;
    .l {
      width: 25%;
      img {
        width: 160rpx;
        height: 120rpx;
      }
    }
    .m {
      width: 50%;
      text-align: left !important;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding-left: 25rpx;
      font-size: 32rpx;
      div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .desc {
        font-size: 28rpx;
        color: #b3b3b3;
      }
    }
    .r {
      width: 25%;
      font-size: 32rpx;
      text-align: center !important;
      .b {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding: 0;
        button {
          width: 34rpx;
          height: 34rpx;
          padding: 0;
          line-height: 34rpx;
          text-align: center;
          font-size: 20rpx;
          margin: 0;
        }
        input {
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
.fahuo {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 28rpx;
  border-bottom: 1px solid #f5f5f5;
  .tips {
    color: $maincolor;
  }
  .m {
    .table {
      width: 100%;
      margin: 0 auto;
      font-size: 28rpx;
      color: #000;
      .tr {
        display: flex;
        flex-direction: row;
        width: 100%;
        div {
          width: 20%;
        }
        div:nth-child(3) {
          margin-left: 40rpx;
        }
      }
    }
  }
}
// .jiesuan{
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-end;
//   button{
//     width: 150rpx;
//     height: 44rpx;
//     line-height: 44rpx;
//     background-color: $maincolor;
//     color: #fff;
//     font-size: 32rpx;
//     text-align: center;
//     margin: 0;
//   }
//   .btnhover{
//     background-color: #9c2518;
//   }
// }
.jiesuan {
  position: fixed;
  bottom: 0;
  width: 710rpx;
  display: flex;
  justify-content: flex-end;
  padding: 10rpx 20rpx;
  background-color: #f3f3f3;
  .total {
    color: $maincolor;
    font-weight: 600;
    padding-right: 20rpx;
  }
  button {
    width: 26%;
    height: 62rpx;
    line-height: 62rpx;
    background-color: $maincolor;
    font-size: 32rpx;
    border-radius: 31rpx;
    color: #fff;
    margin: 0;
  }
  .btnhover {
    background-color: rgb(138, 0, 0);
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
.none {
  display: flex;
  flex-direction: column;
  justify-content: center;
  i.iconfont {
    font-size: 200rpx;
    color: #b3b3b3;
    text-align: center;
  }
  div {
    font-size: 50rpx;
    text-align: center;
    color: #b3b3b3;
  }
}
</style>
