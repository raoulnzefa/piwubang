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

        // 加入购物车
        addtocartUrl:`${host}/weapp/addtocart`,

        // 查询购物车
        cartgoodsUrl:`${host}/weapp/cartgoods`,

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
        gysapplyUrl: `${host}/weapp/gysapply`,
        
        // 组团-搜索帮主
        searchbangzhuUrl: `${host}/weapp/searchbangzhu`,

        // 组团-搜索普通用户商品
        searchzutuanuserUrl: `${host}/weapp/searchzutuanuser`,
        
        // 组团-搜索帮主商品
        searchbangzhugoodsUrl: `${host}/weapp/searchbangzhugoods`,

        // 组团-帮主商品上传
        bangzhugoodsuploadUrl: `${host}/weapp/bangzhugoodsupload`,

        // 组团-搜索该地区已开放小区列表
        getcommunitylistUrl: `${host}/weapp/getcommunitylist`,
        
        // 组团-搜索该小区的商品列表
        getcommunitygoodslistUrl: `${host}/weapp/getcommunitygoodslist`,

        // 周边-周边店铺
        searchroundshopUrl: `${host}/weapp/roundshop`,

        // 周边-周边店铺商品
        searchroundshopgoodsUrl: `${host}/weapp/roundshopgoods`,

        // 周边-检查当前用户是否已注册商铺
        checkuserisshopUrl: `${host}/weapp/checkuserisshop`,

        // 周边-周边店铺入驻申请
        roundshopapplyUrl: `${host}/weapp/roundshopapply`,

        // 周边-周边店铺商品上传
        roundshopgoodsuploadUrl: `${host}/weapp/roundshopgoodsupload`,

    },
    mapkey:'HOOBZ-FGYRX-3SC4H-ZDMLM-6ZJG6-V7BJD'
};

export default config;