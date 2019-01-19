// 小程序退款接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    return ctx.body = {
        code:1,
        data:{},
        success:false,
        msg:"小程序退款接口"
    }
}
