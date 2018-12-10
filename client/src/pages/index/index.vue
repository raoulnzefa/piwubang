<template>
<!-- @click="clickHandle('test click', $event)" -->
  <div class="container">
    <slogan></slogan>   
    <!-- <mp-button>123123</mp-button>  -->
    
    
    <mp-button @click='opensetting'>opensetting</mp-button>
  </div>
</template>

<script>
import card from '@/components/card'
import slogan from '@/components/slogan'
import mpButton from 'mpvue-weui/src/button';

export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {}
    }
  },
  components: {
    card, 
    slogan,
    mpButton
  },
  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      console.log('getuserinfo');
      
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    },
    opensetting(){
      wx.openSetting()
    }
  },
  
  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>

<style scoped lang='scss'>

</style>
