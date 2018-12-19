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

console.log(6666666666666);
const savenotification = async function (ctx, next) {//async
console.log(3333);
    
    
    ctx.body = {
        code:1,
        success: true
    }
}
module.exports = savenotification