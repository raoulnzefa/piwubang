/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'   // 定义所有路由的前缀都已 /weapp 开头
})
// const xmlParser = require('koa-xml-body');

const controllers = require('../controllers')
const unifiedorder = require('../wxpay/pay.js')
const getnotification = require('../wxpay/getnotification.js')
const clientpaid = require('../wxpay/clientpaid.js')


// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口 /weapp/login
router.get('/login', authorizationMiddleware, controllers.login)

// 用户信息接口（可以用来验证登录态） /weapp/user
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中 /weapp/upload
router.post('/upload', validationMiddleware, controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的 /weapp/tunnel
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求 /weapp/message
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)


// GET !!! 小程序查询商品列表
// router.get('/goodslist', validationMiddleware, controllers.getgoodslist)
router.get('/goodslist', controllers.getgoodslist)


// GET !!! 小程序查询商品详情
// router.get('/goodsdetail', validationMiddleware, controllers.getgoodsdetail)
router.get('/goodsdetail', controllers.getgoodsdetail)

// GET !!! 小程序支付
router.get('/prepay', validationMiddleware, unifiedorder)

// GET !!! 小程序支付完成后客户端通知
router.get('/clientpaid', validationMiddleware, clientpaid) //validationMiddleware,



// POST !!! 小程序支付 回调
router.post( '/getnotification',  getnotification.post )
// router.get( '/getnotification',  getnotification.get )


// GET !!! 小程序查询订单列表
// router.get('/orderlist', validationMiddleware, controllers.getorderlist)
router.get('/orderlist', validationMiddleware, controllers.getorderlist)

module.exports = router
