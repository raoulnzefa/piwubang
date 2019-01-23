const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
const { mysql } = qcloud
module.exports = async (ctx, next) => {
    let params = ctx.request.body;
    let openid = ctx.state.$wxInfo.userinfo.openId ;
    console.log('@bangzhuapply  params:',params);
    try{
        let search = await mysql('applysforbz').first().where({openid})
        if( !search ){
            
            if(!params.communityid){
                params.communityid = params.code + '' + Math.floor(Math.random()*(899999999999)+100000000000)
            }else{
                params.communityid = params.code + '' + params.communityid
            }
            // 小区判断
            let query = await mysql('community').select().where(function() {
                this.where({ code: params.code }).andWhere('name', 'like', `%${params.community}%`)
            }).orWhere({ _id: params.communityid })
            console.log('@bangzhuapply query变量:');
            console.log(query, query == undefined);
            if( query.length == 0 ){
                // 说明数据库没有这个小区，添加
                await mysql('community').insert({
                    _id: params.communityid ,
                    name:params.community ,
                    code:params.code ,
                    citylabel1: params.province+params.city+params.country,
                    citylabel2:params.citylabel,
                    longitude:params.longitude,
                    latitude:params.latitude,
                    _bangzhuid: openid
                });
            }

            // 插入帮助申请表
            await mysql('applysforbz').insert({...params,openid})
            return ctx.body = {
                code:"BZ_APPLY_SUCCESS",
                data:{},
                success:true,
                msg:"申请成功"
            }
        }else{
            if(search.status == 1){
                return ctx.body = {
                    code:"BZ_APPLY_CHECKING",
                    data:null,
                    success:false,
                    msg:"审核中，请勿重复申请"
                }
            }else if(search.status == 2){
                return ctx.body = {
                    code:"BZ_APPLY_NONEED_REPEAT",
                    data:null,
                    success:false,
                    msg:"您已是帮主，请勿重复申请"
                }
            }else if(search.status == 3){
                return ctx.body = {
                    code:"BZ_APPLY_REJECTED",
                    data:null,
                    success:false,
                    msg:"有被拒绝的申请，请联系管理员"
                }
            }else{
                return ctx.body = {
                    code:"BZ_APPLY_SYSTEM_ERROR",
                    data:null,
                    success:false,
                    msg:"系统错误，请联系管理员"
                }
            }
        }
    }catch(err){
        console.log('err:',err);
        return ctx.body = {
            code:"BZ_APPLY_SYSTEM_ERROR",
            data:{},
            success:false,
            msg:"系统错误，请联系管理员"
        }
    }
}