// const configs = require('../config')
// const qcloud = require('wafer-node-sdk')(configs)
// const { mysql } = qcloud
// console.log(6666666666666);

// const savenotification = async function (ctx, next) {//async
//     let data = ctx.query
//     console.log(data);

//     // let res = await mysql("wxnotification").insert({data})
//     let res = mysql("wxnotification").insert({data})
//     console.log(res);
    
//     ctx.body = {
//         code:1,
//         success: true
//     }
// }
// module.exports = savenotification




const dbconf = require('../config.js').mysql;
console.log(dbconf);

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

const getnotification = async (ctx, next) => {//async
    let data = ctx.query
    console.log(data);

    let goodsinfo = await knex('t_product').where({
        _id
      }).select()
    console.log(goodsinfo);
    
    return ctx.body = `<xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
    </xml>`
}
module.exports = getnotification