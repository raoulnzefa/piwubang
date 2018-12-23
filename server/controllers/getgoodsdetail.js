const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
const { mysql } = qcloud

module.exports = async (ctx, next) => {
    let goodsid = ctx.query.goodsid ;
    if(goodsid){
        let res = await mysql('t_product').select().where({ _id: goodsid });
       
        let viewcount = res[0].viewcount
        console.log( viewcount );
        let update = await mysql('t_product').update({ viewcount: viewcount+1 }).where({ _id: goodsid });
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
