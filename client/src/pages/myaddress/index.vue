<template>
  <div class="con">
    <!-- <div> -->
      <!-- <address-card v-for='(x,i) in list' :key='i' :info.sync='x' :index='i' @setdefault='setdefault'></address-card> -->
      <div class="card" v-for='(x,i) in list' :key='i'>
        <div class="t main">
          <span>收件人：{{x.userName}}</span>
          <span>联系方式：{{x.telNumber}}</span>
        </div>
        <div class="m main">
          地址：{{x.provinceName}} {{x.cityName}} {{x.countyName}}
          {{x.detailInfo}}
        </div>
        <div class="b main">
          <!-- :class="x.isdefault?'focus':'btn-edit'" -->
          <div :class="x.isdefault?'focus':'btn-edit'" @click="setdefault(i)">
            <div class="btn1" ></div>
            <span>{{x.isdefault?'默认地址':'设为默认'}}</span>
          </div>
          <div class="btn-edit">编辑</div>
          <div class="btn-edit" @click='del(i)'>删除</div>
        </div>
      </div>
      <div class="btm">
        已经到底了
      </div>
    <!-- </div> -->
    <div class="importwx">
      <button  @click="getwxaddress">微信导入</button>
      <button  @click="addaddress">手动添加</button>
    </div>
  </div>
</template>

<script>
import checkscope from "@/wxapis/check_scope";
import authorize from "@/wxapis/authorize";

// import addressCard from "@/components/addressitem";

export default {
  components: {
    // addressCard
  },

  data() {
    return {
      clas: "btn-edit",
      defaulttext: "设为默认",
      list: [
        {
          cityName: "广州市",
          countyName: "海珠区",
          detailInfo: "haha中路397号",
          nationalCode: "510000",
          postalCode: "510000",
          provinceName: "广东省",
          telNumber: "13814878999",
          userName: "张三",
          isdefault: true
        },
        {
          cityName: "上海市",
          countyName: "闵行区",
          detailInfo: "人民中路33号",
          nationalCode: "51001",
          postalCode: "510000",
          provinceName: "上海市",
          telNumber: "13814878444",
          userName: "王朝",
          isdefault: false
        },
        {
          cityName: "苏州市",
          countyName: "吴中区",
          detailInfo:
            "南京中路38号南京中路38号南京中路38号南京中路38号南京中路38号",
          nationalCode: "510000",
          postalCode: "51002",
          provinceName: "江苏省",
          telNumber: "13814878888",
          userName: "马六",
          isdefault: false
        }
      ]
    };
  },

  created() {},
  methods: {
    async getwxaddress() {
      var self = this
      let checkres = await checkscope("scope.address");
      console.log(checkres);
      if (!checkres) {
        let authres = await authorize("scope.address");
        console.log(authres);
      } else {
        wx.chooseAddress({
          success(res) {
            // res:
            //cityName:"广州市",
            //countyName:"海珠区",
            //detailInfo:"新港中路397号",
            //errMsg:"chooseAddress:ok",
            //nationalCode:"510000",
            //postalCode:"510000",
            //provinceName:"广东省",
            //telNumber:"020-81167888",
            //userName:"张三",
            console.log(res);
            delete res.errMsg
            console.log(res);
            self.list.push(res)
          },
          fail(err) {
            console.log( 'err:',err);
          },
          complete() {}
        });
      }
    },
    addaddress(){
      // 手动新增地址
    },
    getmyaddress() {},
    setdefault(index) {
      var self = this
      console.log(index);
      this.list.map(function(v, i) {
        console.log(i);
        self.list[i].isdefault = false;
      });
      
      // setTimeout(function(){
        self.list[index].isdefault = true
      // },300)
      console.log(this.list);
      this.saveaddress()
    },
    saveaddress(){
      // qc.request({
      //   // url:,
      //   method:"POST",
      //   data:{},
      //   success(res){

      //   },
      //   fail(err){

      //   }
      // })
    },
    del(x){
      this.list.splice(x,1)
    }
  },
  onShow() {
    this.getmyaddress();
  }
};
</script>

<style lang='scss' scoped>
$maincolor: #ce4031;
.con {
  width: 100%;
  min-height: 100%;
  background-color: #eee;
  position: absolute;
  top: 0;
  bottom: 0;
  .card {
    padding: 12rpx 20rpx;
    margin: 0 auto 12rpx;
    background-color: #fff;
    .main {
      font-size: 32rpx;
    }
    .m {
      padding-bottom: 12rpx;
    }
    .b {
      border-top: 1px solid rgb(204, 204, 204);
      padding-top: 12rpx;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      color: rgb(173, 173, 173);

      & > div {
        margin: 0 20rpx 0 0;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 30rpx;
      }
      .btn-edit {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      .btn1 {
        display: inline-block;
        border: 1px solid rgb(173, 173, 173);
        height: 30rpx;
        width: 30rpx;
        border-radius: 20rpx;
        box-sizing: border-box;
      }
      .focus {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .btn1 {
          display: inline-block;
          border: none;
          background-color: $maincolor;
          height: 30rpx;
          width: 30rpx;
          border-radius: 20rpx;
          box-sizing: border-box;
        }
        span {
          color: $maincolor;
        }
      }
    }
  }
  .importwx{
    width: 100%;
    position: fixed;
    bottom: 0rpx;
    z-index: 2;
    background-color: #fff;
    padding: 20rpx 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    button{
      width: 40%;
      background-color: $maincolor;
      height: 60rpx;
      line-height: 60rpx;
      color: #fff;
      border: none;
      border-radius: 30rpx;
      margin: 0;
      display: block;
    }
  }
  .btm{
    text-align: center;
    font-size: 28rpx;
    color: #ccc;
    padding-bottom: 100rpx;
    background-color: #eee;
    width: 100%;
  }
}
</style>
