<template>
    <div class="container">
        <div>组团界面</div>
        <!-- <map-route :route-info="routeInfo"></map-route> -->
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
                // routeInfo: routeInfo
            }
        },
        onLoad(){
            wx.showShareMenu({
            withShareTicket: true
            })
        },
    }
</script>
<style lang="scss" scoped>

</style>
