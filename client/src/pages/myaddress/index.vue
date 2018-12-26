<template>
  <div class="con">
    <div>
      <button @click="getwxaddress">快速导入</button>
    </div>
    <div></div>
  </div>
</template>

<script>
import checkscope from '@/wxapis/check_scope'
import authorize from '@/wxapis/authorize'


import address from '@/components/addressitem'


export default {
  components: {
    address
  },

  data () {
    return {
    }
  },

  created () {
    
  },
  methods:{
    async getwxaddress(){
      let checkres = await checkscope('scope.address')
      console.log(checkres);
      if(!checkres){
        let authres = await authorize('scope.address')
        console.log(authres);
      }else{
        wx.chooseAddress({
          success(res){
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
            
          },
          fail(err){
            console.log(err);
            
          },
          complete(){

          }
        })
      }
    }
    
  }
}
</script>

<style lang='scss' scoped>
.con{

}
</style>
