const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
const { mysql } = qcloud

module.exports = async (ctx, next) => {
    let openid = ctx.state.$wxInfo.userinfo.openId ;
    let goodsid = ctx.query.goodsid
    console.log(openid, goodsid);
    
    let now = new Date()
    let timestamp = now.getTime()
    let _time = now.toLocaleString()
    try {
        if(goodsid && goodsid!='undefined'){
            let cartinfo = await mysql('cart').select().where({openid})
            console.log('cartinfo:',cartinfo);
            if(cartinfo.length == 1){
                let cartgoods = JSON.parse(cartinfo[0].cartgoods)
                for(let i=0,l=cartgoods.length;i<l;i++){
                    if(cartgoods[i].goodsid == goodsid){
                        return ctx.body = {
                            code:0,
                            success:false,
                            data:{},
                            msg:"该商品已在购物车"
                        } 
                    }
                }
                // 根据goodsid查询商品信息 过期否 存在否
                let searchgoods = await mysql('t_product').select('currentPrice','briefDesc','remaining','thumbnail','sxtype','targetArea_name','deliveryMethods').where({_id:goodsid})
                if(searchgoods.length == 1){
                    let goodsinfo = searchgoods[0]
                
                    console.log('goodsinfo:',goodsinfo);
                    
                    if(goodsinfo && goodsinfo.expired != 0 && goodsinfo.remaining > 0){
                        console.log('已有购物车信息，更新。');
                        // 更新购物车信息
                        cartgoods.unshift({
                            goodsid,
                            goodsname: goodsinfo.goodsname,
                            thumbnail: goodsinfo.thumbnail,
                            price: goodsinfo.currentPrice,
                            count: 1,
                            desc: goodsinfo.briefDesc,
                            remaining: goodsinfo.remaining,
                            sxtype: goodsinfo.sxtype,
                            targetArea_name:goodsinfo.targetArea_name,
                            deliveryMethods:goodsinfo.deliveryMethods
                        })
                        let string = JSON.stringify(cartgoods)
                        await mysql('cart').update({cartgoods: string}).where({openid})
                        return ctx.body = {
                            code: 1,
                            success: true,
                            data: {},
                            msg: "加入购物车成功"
                        }
                    }else{
                        console.log('expired为1 或 remaining小于1');
                        // 无此商品
                        return ctx.body = {
                            code: 0,
                            success: false,
                            data: {},
                            msg: "该商品已过期"
                        }
                    }
                }else{
                    return ctx.body = {
                        code: 0,
                        success: false,
                        data: {},
                        msg: "该商品已过期"
                    }
                }
            }else{
                // 没有购物车信息  直接插入
                // 根据goodsid查询商品信息 过期否 存在否
                console.log('没有购物车信息  直接插入');
                console.log('goodsid:',goodsid);
                let goodsinfos = await mysql('t_product').select('currentPrice','briefDesc','remaining','thumbnail','sxtype','targetArea_name','deliveryMethods').where({_id:goodsid})
                let goodsinfo = goodsinfos[0]
                console.log('goodsinfo:',goodsinfo);
                if(goodsinfo && !goodsinfo.expired && goodsinfo.remaining > 0){
                    let cartgoods = [{
                        goodsid,
                        goodsname: goodsinfo.goodsname,
                        thumbnail: goodsinfo.thumbnail,
                        price: goodsinfo.currentPrice,
                        count: 1,
                        desc: goodsinfo.briefDesc,
                        remaining: goodsinfo.remaining,
                        sxtype: goodsinfo.sxtype,
                        targetArea_name:goodsinfo.targetArea_name,
                        deliveryMethods:goodsinfo.deliveryMethods
                    }]
                    let string = JSON.stringify(cartgoods)
                    await mysql('cart').insert({openid,timestamp,_time,cartgoods: string})
                    return ctx.body = {
                        code: 1,
                        success: true,
                        data: {},
                        msg: "加入购物车成功"
                    }
                }else{
                    console.log('expired为1 或 remaining小于1');
                    
                    // 无此商品
                    return ctx.body = {
                        code: 0,
                        success: false,
                        data: {},
                        msg: "该商品已过期",
                        reason:'expired为1 或 remaining小于1'
                    }
                }
            }
        }else{
            return ctx.body = {
                code:0,
                success:false,
                data:{},
                msg:"该商品不存在"
            }
        }
    } catch (err) {
        console.log(err);
        return ctx.body = {
            code:0,
            success:false,
            data:{},
            msg:"商品查询出错"
        }
    }
}