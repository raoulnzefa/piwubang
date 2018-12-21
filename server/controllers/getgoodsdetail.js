const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
const { mysql } = qcloud

module.exports = async (ctx, next) => {
    let goodsid = ctx.query.goodsid ;
    if(goodsid){
        let res = await mysql('t_product').select().where({ _id: goodsid });
        console.log(res[0].viewcount);
        ctx.body = {
            code:1,
            success:true,
            msg:"商品详情成功",
            data:res[0]
        }
    }else{
        ctx.body = {
            code:1,
            success:true,
            msg:"该商品不存在",
            data:{}
        }
    }
    
}
