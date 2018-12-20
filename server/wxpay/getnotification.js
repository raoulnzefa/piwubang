const configs = require('../config')
const qcloud = require('wafer-node-sdk')(configs)
var parseString = require('xml2js').parseString ;
const xmlParser = require('../utils/xmlparse');
const { mysql } = qcloud

const post = async function (ctx, next) {
  
    let data = JSON.stringify(ctx.xmlbody.xml) //ctx.request.body
    console.log('-------data----------');
    console.log(data);
    console.log('-------data end-------');
    var res = await mysql("wxnotification").insert( {data:data} )
    console.log(res);

    return ctx.body = `<xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
    </xml>`
}

const get = async function (ctx, next) {//async
    let data = ctx.query// ctx.query
    console.log('------------data------------');
    console.log(data);
    
    console.log('------------data end------------');

    // await parseString(data, async function (err, jsondata) {
    //     if(err){
    //         console.log('------------err------------');
    //         console.log(err);
    //         console.log('------------err end------------');
    //         // throw err

    //         let res = await mysql("wxnotification").insert({data:err})
    //         return ctx.body = `<xml>
    //             <return_code><![CDATA[FAIL]]></return_code>
    //             <return_msg><![CDATA[xml格式错误，无法转换为json]]></return_msg>
    //         </xml>`
    //     }
        if( typeof data === 'object'){
            var res = await mysql("wxnotification").insert( { ...data } )
        }else{
            var res = await mysql("wxnotification").insert( {data:data} )
        }
        console.log(res);
        return ctx.body = `<xml>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <return_msg><![CDATA[OK]]></return_msg>
        </xml>`
    // });
}


// savenotification()
module.exports = {
    get,post
}