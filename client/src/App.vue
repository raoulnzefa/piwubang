<script>
import qc from 'wafer2-client-sdk'
import config from '@/config'

export default {
  data:function(){
    return {
      appdata:"66666",
      logged:false,
      authmodalshowL:false
    }
  },
  
  methods:{
    
    
  },
  // created () {
    
  // },
  onLaunch(){
    console.log('app onlunch');
    qc.setLoginUrl(config.service.loginUrl);  
  }
}
</script>

<style>
.container {
  height: 100%;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; */
  
  box-sizing: border-box;
}

</style>
