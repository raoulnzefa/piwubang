const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
const { mysql } = qcloud

module.exports = async (ctx, next) => {
    try {
        let code = ctx.query.code
        let name = ctx.query.community
        let citylabel1 = ctx.query.citylabel1
        let citylabel2 = ctx.query.citylabel2
        let longitude = ctx.query.longitude
        let latitude = ctx.query.latitude        
        let _id = code + '' +ctx.query.communitymarkid
        console.log('@getcommunitylist 参数：');
        console.log(ctx.query);
        
        if(!code){
            return ctx.body = {
                code:"ZUTUAN_CITYCODE_UNVALID",
                success:false,
                msg:"地区码错误",
                data:[]
            }
        }
        // 查询改地址是否数据库
        // let query = await mysql('community').first().where({ code }).orWhere({ code }).orWhere({ code });
        let query = await mysql('community').select().where(function() {
            this.where({ code }).andWhere('name', 'like', `%${name}%`)
        }).orWhere({ _id })
        console.log('@getcommunitylist query变量:');
        console.log(query, query == undefined);
        if( query.length == 0 ){
            // 说明数据库没有这个小区，添加
            await mysql('community').insert({
                _id,
                name,
                code,
                citylabel1,
                citylabel2,
                longitude,
                latitude
            });
            return ctx.body = {
                code: "ZUTUAN_GET_COMMUNITY_SUCCESS",
                success:true,
                msg:"小区列表获取成功",
                data: [{
                    _id,
                    name,
                    code,
                    citylabel1,
                    citylabel2,
                    longitude,
                    latitude
                }]
            }
        }
        // let res = await mysql('community').select().where({code}).orderBy({id: 'desc'});
        console.log('该地区已开放, 信息是：', query);
        return ctx.body = {
            code: "ZUTUAN_GET_COMMUNITY_SUCCESS",
            success:true,
            msg:"小区列表获取成功",
            data: query
        }
    } catch (error) {
        console.log(error);
        return ctx.body = {
            code: "ZUTUAN_GET_COMMUNITY_FAILED",
            success:false,
            msg:"数据错误，请重新选择定位",
            data:[]
        }
    }
}
