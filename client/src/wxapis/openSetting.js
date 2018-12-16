
const openSetting = async (option) => {
    return new Promise(function(resolve, reject){
        wx.openSetting( {
            success(res) {
                resolve(res.authSetting)
            }
        } )
    }) 

}
export default openSetting