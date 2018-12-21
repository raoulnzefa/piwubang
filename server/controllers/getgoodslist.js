const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
const { mysql } = qcloud

module.exports = async (ctx, next) => {
    // let goodsid = 
    let res = await mysql('t_product').select();
    console.log(res);
    ctx.body = {
        code:1,
        success:true,
        msg:"商品列表获取成功",
        data:res
    }
}
