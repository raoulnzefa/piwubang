<template>
    <div class="container">
        <mp-button open-type='getUserInfo' @getuserinfo='getUserInfo'>123</mp-button>
    </div>
</template>
<script>
    export default {
        onLoad(){
            wx.showShareMenu({
            withShareTicket: true
            })
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

</style>
