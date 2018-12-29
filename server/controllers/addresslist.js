const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
const { mysql } = qcloud
module.exports = async (ctx, next) => {
    let open_id = ctx.state.$wxInfo.userinfo.openId ;
    try {
        let searchs = await mysql('cSessionInfo').select('receipt').where({open_id})
        console.log(searchs);
        
        let search = JSON.parse(searchs[0].receipt)
        return ctx.body = {
            code:'USER_ADDRESS_QUERY_SUCCESS',
            data:search,
            msg:"地址查询成功"
        }
    } catch (err) {
        console.log(err);
        
        return ctx.body = {
            code:'USER_ADDRESS_QUERY_FAILED',
            data:{},
            msg:"地址查询失败"
        }
    }
}