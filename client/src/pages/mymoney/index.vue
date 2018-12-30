<template>
    <div class="con">
        <div class="title">我的余额</div>
        <div class="money">￥{{mymoney}}</div>
        <div class="tixian">
            <button hover-class='btnhover' @click="tixian">提现</button>
        </div>
    </div>
</template>
<script>
// let plugin = requirePlugin("myPlugin")
// let routeInfo = {
//     startLat: 39.90469,    //起点纬度 选填
//     startLng: 116.40717,    //起点经度 选填
//     startName: "我的位置",   // 起点名称 选填
//     endLat: 39.94055,    // 终点纬度必传
//     endLng :116.43207,  //终点经度 必传
//     endName:"来福士购物中心",  //终点名称 必传
//     mode:'car'  //算路方式 选填
// }
    export default {
        data: function(){
            return {
                mymoney:0.00,
                
            }
        },
        methods: {
            tixian(){
                wx.showToast({
                    title:"余额不足",
                    icon:"none",
                    duration: 1500
                })
            }
        },
        onLoad(){
            // wx.showShareMenu({
            //     withShareTicket: true
            // })

        },
        onShow(){
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
        }
    }
</script>
<style lang="scss" scoped>
$maincolor: #ce4031;

.con{
    padding: 50rpx;
    &>div{
        text-align: center;
    }
    .title{

    }
    .money{
        font-size: 50rpx;
        // color: $maincolor;
        font-weight: 700;
    }
    .tixian{
        margin-top: 40rpx;
        button{
            background-color: $maincolor;
            width: 30%;
            color: #fff;
        }
        .btnhover{
            background-color: rgb(150, 0, 0);
            color: rgb(206, 206, 206);
        }
    }
}
</style>
