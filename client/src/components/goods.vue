<template>
  <div>
    
  </div>
</template>

<script>
export default {
    data: function(){
      return {
        show: true
      }
    },
    methods:{
      hide(){
        this.show = false
        console.log(this.show );
        
      }
    }
}
</script>

<style lang='scss' scoped>
  div{
    width: 750rpx;
    background: pink;
    position: relative;
    img{
      width: 100%;
      float:left;
    }
    .off{
      display: block;
      position: absolute;
      right: 8rpx;
      top: 8rpx;
      color: #fff;
    }
  }
</style>
