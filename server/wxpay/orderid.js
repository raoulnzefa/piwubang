/**
 * long description for the file
 *
 * @summary 订单号生成
 * @author Shen Jie
 *
 * Created at     : 2018-12-18 16:39:12 
 * Last modified  : 2018-12-18 18:15:39
 */

const generateOrderId = function(){
    // 规则：日期 + 随机6位数 + 时间戳后4位 + openid
    let now = new Date()
    
    // 20181218 日期
    let part1 = now.toISOString().substr(0, 10).split('-').join('')
    // console.log(part1);
    // 2427 4位随机数
    let part2 = Math.floor(Math.random()*(9999-1000)+1000)
    // console.log(part2);
    // 086 毫秒数
    let part3 = (now.getTime()+'').substr(-3,3)
    // console.log(part3);
    // 4位36进制随机数
    let part4 = Math.random().toString(36).substr(-5,5)
    // console.log(part4);
    let res = part1 + part2 + part3 + part4
    console.log(res);
    return res
}
// generateOrderId()
module.exports = generateOrderId