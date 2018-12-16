// 打开地图 选择位置
const chooselocation = async () => {
    return new Promise(function(resolve, reject){
        wx.chooseLocation( {
            success(res) {
                // name address 纬度latitude 经度longitude
                resolve(res)
            },
            fail:function(){
                resolve(false)
            },
            complete:function(){
                wx.hideLoading()
            }
        } )
    }) 

}
export default chooselocation