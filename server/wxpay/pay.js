/**
 * long description for the file
 *
 * @summary short description for the file
 * @author shenjie
 *
 * Created at     : 2018-12-17 16:14:34 
 * Last modified  : 2018-12-17 18:56:10
 */

var request = require('request');
var xmlreader = require("xmlreader");
var fs = require("fs");
var payutil = require('./utils');

// 支付配置项
const appid = 'wx88152eef614c3441';
const appsecret = '37971006ed3baa814e0de260131788cd';
const mchid = '1515387251'
const mchkey = 'TVU1MO18PS9YQLW58P2SENSEW6O46JIY';
const wxurl = 'http://www.tech997.cn/';

const unifiedorder = (ctx, next) => {
    console.log('ctx.query:');
    console.log(ctx);
    console.log('-------------');

    
    //首先拿到前端传过来的参数
    let orderCode = ctx.query.orderCode;
    let money =     ctx.query.money;
    let orderID =   ctx.query.orderID;

    console.log('APP传过来的参数是：', orderCode + '----' + money + '------' + orderID );
    
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
    let out_trade_no = orderCode;
    let total_fee = payutil.getmoney(0.38);
    let spbill_create_ip = ctx.req.connection.remoteAddress;
    console.log('ip:' + spbill_create_ip);
    
    let notify_url = wxurl;
    let trade_type = 'JSAPI';

    let sign = payutil.paysignjsapi(
        appid,
        body,
        mch_id,
        mchkey,
        nonce_str,
        notify_url,
        out_trade_no,
        spbill_create_ip,
        total_fee,
        trade_type
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
    formData += "<sign>" + sign + "</sign>";
    formData += "</xml>";

    console.log('formData===', formData);
    //官方API https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
    var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    

    request({ url: url, method: 'POST', body: formData }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log(body);

            xmlreader.read(body.toString("utf-8"), function (errors, response) {
                if (null !== errors) {
                    console.log(errors)
                    return;
                }
                console.log('长度===', response.xml.prepay_id.text().length);
                var prepay_id = response.xml.prepay_id.text();
                console.log('解析后的prepay_id==', prepay_id);


                //将预支付订单和其他信息一起签名后返回给前端
                let finalsign = payutil.paysignjsapifinal(appid, mch_id, prepay_id, nonce_str, timestamp, mchkey);

                ctx.body = { 
                    'appId': appid, 
                    'partnerId': mchid, 
                    'prepayId': prepay_id, 
                    'nonceStr': nonce_str, 
                    'timeStamp': timestamp, 
                    'package': 'Sign=WXPay', 
                    'sign': finalsign 
                }

            });


        }
    });

}

module.exports = unifiedorder