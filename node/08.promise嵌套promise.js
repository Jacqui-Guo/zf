// 上一个的输出是下一个输入
// try catch 只能捕获同步
// 判断promise === promise  报错

/**
 * 处理问题：
 *  1、promise 内部嵌套 promise 的情况
 *  2、then() 函数中，不传递参数的情况
 *  3、写 Promise.resolve() 静态方法
 *  4、处理.catch() 单独写的情况  (catch方法就是没有成功的失败)
 */

let Promise = require('./source/3.promise');

// new Promise((resolve,reject) => {
//  resolve('success')   
// }).then(res => {
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             resolve('ok')
//         },1000)
//     })
// },err => {
//     console.log('失败1',err)
// }).then(res => {
//     console.log('成功2',res) 
// },err => {
//     console.log('失败2',err)
// })

Promise.resolve(1).then(res =>{
    console.log(res)
}).catch()
