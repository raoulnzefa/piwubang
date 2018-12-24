/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// var host = 'http://192.168.2.102:8899';
// var host = 'http://192.168.1.146:8899';
var host = 'http://111.231.78.250:8899';



var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        // requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        // tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        // 获取热门商品列表（轮播图）
        swiperUrl: `${host}/weapp/swiper`,

        // 获取商品列表
        goodslistUrl: `${host}/weapp/goodslist`,
                
        // 获取商品详情
        goodsdetailUrl: `${host}/weapp/goodsdetail`,

        // 获取收货地址列表
        addresslistUrl: `${host}/weapp/addresslist`,

        // 收货地址修改
        addresseditUrl: `${host}/weapp/addressedit`,

        // 通过后端调统一下单接口
        prepayUrl: `${host}/weapp/prepay`,

        // 获取订单列表
        getOrderList: `${host}/weapp/orderlist`,

        // 确认收货
        confirmshipUrl: `${host}/weapp/confirmship`,

        // 退货退款申请
        refundUrl: `${host}/weapp/refund`,

        // 删除订单
        deleteorderUrl: `${host}/weapp/deleteorder`,

        // 前端已支付，告知服务器
        clientpaidUrl: `${host}/weapp/clientpaid`,

        // 帮主申请
        bangzhuapplyUrl: `${host}/weapp/bangzhuapply`,

        // 供应商、厂商申请
        makerapplyUrl: `${host}/weapp/makerapply`
        

    }
};

export default config;