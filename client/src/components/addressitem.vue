<template>
  <div class="con">
    <div class="t main">
      <span>收件人：{{info.userName}} </span>
      <span>联系方式：{{info.telNumber}}</span>
    </div>
    <div class="m main">
      地址：{{info.provinceName}} {{info.cityName}} {{info.countyName}} 
      {{info.detailInfo}}
    </div>
    <div class="b main">
      <div :class='clas' @click='setdefault'>
        <div class="btn1"></div>
        <span>{{defaulttext}}</span>
      </div>
      <div class='btn-edit'>编辑</div>
      <div class='btn-edit'>删除</div>
    </div>
  </div>
</template>

<script>
// provinceName:"广东省",
// cityName:"广州市",
// countyName:"海珠区",
// detailInfo:"新港中路397号",
// nationalCode:"510000",
// postalCode:"510000",
// telNumber:"13814878999",
// userName:"张三"

export default {
  props: ['info','index'],
  data:function(){
    return {
      clas:'btn-edit',
      defaulttext:'设为默认'
    }
  },
  methods: {
    setdefault(){
      this.$emit('setdefault', this.index)
      this.clas = 'focus'
      this.defaulttext = '默认地址'
    }
  },
  created() {
    console.log('address info index',this.info, this.index);
    if(this.info.isdefault){
      this.clas = 'focus'
      this.defaulttext = '默认地址'
    }else{
      this.clas = 'btn-edit'
      this.defaulttext = '设为默认'
    }
  }
}
</script>

<style lang='scss' scoped>
$maincolor: #ce4031;
.con{
  padding: 12rpx 20rpx;
  margin: 12rpx auto 0;
  background-color: #fff;
  .main{
    font-size: 32rpx;
  }
  .m{
    padding-bottom: 12rpx;
  }
  .b{
    border-top:1px solid rgb(204, 204, 204);
    padding-top: 12rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: rgb(173, 173, 173);
    
    &>div{
      margin: 0 20rpx 0 0;
      height: 40rpx;
      line-height: 40rpx;
      font-size: 30rpx;
    }
    .btn-edit{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .btn1{
      display: inline-block;
      border:1px solid rgb(173, 173, 173);
      height: 30rpx;
      width: 30rpx;
      border-radius: 20rpx;
      box-sizing: border-box; 
    }
    .focus{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .btn1{
        display: inline-block;
        border:none;
        background-color: $maincolor;
        height: 30rpx;
        width: 30rpx;
        border-radius: 20rpx;
        box-sizing: border-box; 
      }
      span{
        color: $maincolor;
      }
    }
  }
}
</style>
