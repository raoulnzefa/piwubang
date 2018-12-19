/**
 * 微信统一下单API
 *
 * @summary short description for the file
 * @author shenjie
 *
 * Created at     : 2018-12-17 16:14:34 
 * Last modified  : 2018-12-19 17:38:42
 */
var request = require('request');
var xmlreader = require("xmlreader");
// var xml2js = require("xml2js");
// var xmlparser = new xml2js.Parser();
var fs = require("fs");
var payutil = require('./utils');
var generateOrderId = require('./orderid.js');
const errcodes = require('./errcodes.js');
const dbconf = require('../config.js').mysql;
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: dbconf.host,
        port: dbconf.port,
        user: dbconf.user,
        password: dbconf.pass,
        database: dbconf.db,
        charset: dbconf.char,
        multipleStatements: true
    },
    // useNullAsDefault: true
});

// 支付配置项
const appid = 'wx88152eef614c3441';
const appsecret = '37971006ed3baa814e0de260131788cd';
const mchid = '1515387251' //商户号
const mchkey = 'TVU1MO18PS9YQLW58P2SENSEW6O46JIY'; // 商户API密码
const wxurl = 'http://www.tech997.cn/';// 下单后的通知地址

const unifiedorder = async (ctx, next) => {
    // console.log('ctx.query:');
    // console.log(ctx.query);
    // console.log('-------------');

    // 用户信息 存储于 ctx.state.$wxInfo
    console.log(ctx.state.$wxInfo);
    // STEP1 用户校验
    if(!ctx.state.$wxInfo || ctx.state.$wxInfo.loginState !== 1 ){
        ctx.body = {
            code:0,
            data:{},
            success:false,
            msg:"用户尚未登录"
        }
        return
    }
    // STEP2 拿到前端传过来的参数 查询商品，计算价格
    let {_id, count} = ctx.query
    console.log(`APP传过来的参数是：goodsid:${_id},count:${count}` );
    let goodsinfo = await knex('goods').where({
        _id
      }).select()
    console.log(goodsinfo);
    if(goodsinfo.length<1){
        ctx.body = {
            code:0,
            success:false,
            data:{},
            msg:"该商品不存在"
        }
        return
    }
    if(goodsinfo.length>1){
        ctx.body = {
            code:0,
            success:false,
            data:{},
            msg:"商品信息有误，暂无法购买"
        }
        return
    }
    let singleprice = goodsinfo[0].currentPrice ;
    let total_price = singleprice * count ;
    console.log(singleprice, total_price);
    // console.log(parseFloat(total_price));
    console.log(total_price*100);

    console.log(Math.floor(parseFloat(total_price)*100));
    
    // STEP3 组装数据，签名
    // let orderid = "asc4as1cas1c3" 
    let orderid = generateOrderId(); 
    let money =  0.39   //ctx.query.money;
    let openid = ctx.state.$wxInfo.userinfo.openId // oxw_15Ul35xC40YCRmCxSgzl1trQ
    /**
     * 小程序ID     appid                是  String(32)
     * 商户号	    mch_id	             是	String(32) 
     * 用户标识	    openid	             否	String(128)	oUpF8uMuAJO_M2pxb1Q9zNjWeS6o
     * 随机字符串	nonce_str	         是	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS 32位以内
     * 商品描述	    body	             是	String(128)	腾讯充值中心-QQ会员充值
     * 商户订单号	out_trade_no	     是	String(32)	20150806125346
     * 标价金额	    total_fee	         是	Int	88      单位是 分
     * 终端IP	    spbill_create_ip	 是	String(16)	123.12.12.123
     * 通知地址	    notify_url	         是	String(256)	http://www.weixin.qq.com/wxpay/pay.php
     * 交易类型	    trade_type	         是	String(16)	JSAPI
     * 商品ID	    product_id	         否	String(32)	12235413214070356458058
     * 签名	        sign	             是	String(32)
     * 
     * 设备号	    device_info	         否	String(32)
     * 签名类型	    sign_type	         否	String(32)	MD5
     * 商品详情	    detail	             否	String(6000)	 
     * 附加数据	    attach	             否	String(127)	深圳分店
     * 标价币种	    fee_type	         否	String(16)	CNY
     * 交易起始时间	time_start	         否	String(14)	20091225091010
     * 交易结束时间	time_expire	         否	String(14)	20091227091010 
     * 订单优惠标记	goods_tag	         否	String(32)	WXG
     * 指定支付方式	limit_pay	         否	String(32)	no_credit
     * 电子发票入口开放标识	receipt	      否 String(8)	Y
     * 
     */
    //首先生成签名sign
    let mch_id = mchid;
    let nonce_str = payutil.randomstr(12); //随机字符串
    let timestamp = payutil.createTimeStamp();
    let body = '测试微信支付';
    let out_trade_no = orderid;
    let total_fee = payutil.getmoney(total_price);
    console.log('total_fee:' + total_fee);
    let spbill_create_ip = ctx.req.connection.remoteAddress;
    console.log('ip:' + spbill_create_ip);
    
    let notify_url = wxurl;
    let trade_type = 'JSAPI';

    let sign = payutil.paysignjsapi(
        appid,
        body,
        mch_id,
        nonce_str,
        notify_url,
        out_trade_no,
        spbill_create_ip,
        total_fee,
        trade_type,
        mchkey,
        openid
    );

    console.log('sign==', sign);

    //组装xml数据
    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>";  //appid
    formData += "<body><![CDATA[" + "测试微信支付" + "]]></body>";
    formData += "<mch_id>" + mch_id + "</mch_id>";  //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
    formData += "<notify_url>" + notify_url + "</notify_url>";
    formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
    formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
    formData += "<total_fee>" + total_fee + "</total_fee>";
    formData += "<trade_type>" + trade_type + "</trade_type>";
    formData += "<openid>" + openid + "</openid>";
    formData += "<sign>" + sign + "</sign>";
    formData += "</xml>";

    // STEP4  访问微信统一下单接口
    // console.log('formData===', formData);
    //官方API https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
    var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    let getunifiedorder = async function(url, formData ){
        return new Promise(function(resolve, reject){
            request({ url: url, method: 'POST', body: formData}, function (err, response, body) {
                // <return_code>SUCCESS</return_code>
                // <return_msg>OK</return_msg>
                // <appid>wx88152eef614c3441</appid>
                // <mch_id>1515387251</mch_id>
                // <nonce_str>E3IJD5CqvIkPjc1O</nonce_str>
                // <sign>063F2EA1DEAC50D8368CE175625AF0F2</sign>
                // <result_code>SUCCESS</result_code>
                // <prepay_id>wx1910481141631646d6dc29d92506243212</prepay_id>
                // <trade_type>JSAPI</trade_type>
                
                if (!err && response.statusCode == 200) {
                    xmlreader.read(body.toString("utf-8"), function (errors, response) {
                        if (null !== errors) {
                            // xml信息读取出错
                            console.log(errors)
                            return;
                        }
                        
                        // wx 返回码 String(16)
                        let return_code = response.xml.return_code.text()
                        // wx返回信息 String(128)
                        let return_msg = response.xml.return_msg.text()

                        if(return_code !== 'SUCCESS'){
                            console.log(`统一下单接口调用失败。return_code是：${return_code},返回信息是：${return_msg}`);
                            resolve({
                                code:0,
                                success:false,
                                data:{},
                                msg:`统一下单接口调用失败。return_code是：${return_code},返回信息是：${return_msg}`
                            })
                            return
                        }
        // return_code为SUCCESS的时候有返回以下内容：
        // 小程序ID	    appid	        是	String(32)	wx8888888888888888	调用接口提交的小程序ID
        // 商户号	    mch_id	        是	String(32)	1900000109	调用接口提交的商户号
        // 设备号	    device_info	    否	String(32)	013467007045764	自定义参数，可以为请求支付的终端设备号等
        // 随机字符串	nonce_str	    是	String(32)	5K8264ILTKCH16CQ2502SI8ZNMTM67VS	微信返回的随机字符串
        // 签名	        sign	        是	String(32)	C380BEC2BFD727A4B6845133519F3AD6	微信返回的签名值，详见签名算法
        // 业务结果	    result_code	    是	String(16)	SUCCESS	SUCCESS/FAIL
        // 错误代码	    err_code	    否	String(32)	SYSTEMERROR	详细参见下文错误列表
        // 错误代码描述	 err_code_des	否	String(128)	 系统错误	错误信息描述
                        // wx返回信息 String(128)
                        let result_code = response.xml.result_code.text()
                        if(result_code !== 'SUCCESS'){
                            let err_code = response.xml.err_code.text();
                            let err_code_des = response.xml.err_code_des.text();
                            console.log(`统一下单接口调用成功，但微信服务端下单业务处理出错。错误码是${err_code};错误描述：${err_code_des};产生原因：${errcodes[err_code].reason};解决方法：${errcodes[err_code].fix}`);
                            resolve({
                                code:0,
                                success:false,
                                data:{
                                    err_code, 
                                    err_code_des,
                                    reason: errcodes[err_code].reason ,
                                    fix: errcodes[err_code].fix
                                },
                                msg:`统一下单接口调用成功，但微信服务端下单业务处理出错。错误码是${err_code};错误描述：${err_code_des};产生原因：${errcodes[err_code].reason};解决方法：${errcodes[err_code].fix}`
                            })
                            return
                        }

                        // 此处表示统一下单业务处理成功
                        // 存订单号和openid到订单表
                        knex('orders').insert({
                            openid:openid,
                            
                        })



                        console.log('长度===', response.xml.prepay_id.text().length);
                        var prepay_id = response.xml.prepay_id.text();
                        //将预支付订单和其他信息一起签名后返回给前端
                        let paySign = payutil.paysignjsapifinal(appid, mch_id, prepay_id, nonce_str, timestamp, mchkey);
                        console.log('paySign:',paySign);
                        resolve({ 
                            'data':{
                                'prepayId':  prepay_id, 
                                'nonceStr':  nonce_str, 
                                'timeStamp': timestamp, 
                                'package':   'prepay_id='+prepay_id, 
                                'paySign':   paySign,
                            },
                            'success':   true,
                            'code':      1,
                            'msg':       '统一下单业务处理成功，可以进行支付。'
                        })
                    });
        
        
                }else{
                    resolve(err)
                }
                
            });
        })
    }
    
    let res = await getunifiedorder(url, formData )
    ctx.body = res
}

module.exports = unifiedorder