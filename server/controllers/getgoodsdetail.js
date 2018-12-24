const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
const { mysql } = qcloud

module.exports = async (ctx, next) => {
    let goodsid = ctx.query.goodsid ;
    if(goodsid){
        let data = await mysql('t_product').select().where({ _id: goodsid });
        console.log(data);
        if(data.length == 1){
            let res = data[0]
            res.urls = res.urls ? JSON.parse(res.urls):[]
            res.detailImg = res.detailImg ? JSON.parse(res.detailImg):[]
            res.marketPrice = res.marketPrice ? JSON.parse(res.marketPrice):[]
            ctx.body = {
                code:1,
                success:true,
                msg:"商品详情成功",
                data:res
            }
            let viewcount = res.viewcount||0;
            console.log( viewcount );
            let update = await mysql('t_product').update({ viewcount: viewcount+1 }).where({ _id: goodsid });
        }else{
            ctx.body = {
                code:1,
                success:true,
                msg:"该商品不存在",
                data:{}
            }
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
