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
    }
</script>
<style lang="scss" scoped>

</style>
