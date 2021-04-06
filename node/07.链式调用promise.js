// promise 的特点
/**
 * 解决了什么问题
 *  1、链式调用，解决嵌套回掉的问题 (回掉地狱的问题)
 *  2、同步并发问题
 */


 // 总结：如果返回一个普通值(不是promise的情况) 就会传递给下一个 then 的成功，
 //      如果返回一个失败的promise或者抛出异常，会走下一个 then 的失败  

// 只要返回的是一个正常值，就是resolve

// try...catch 捕捉函数立即执行，而且没有同步异步的情况
//  try{

//  }catch(e){

//  }

// 1、解决链式调用
// 2、解决链式调用过程中的异步

let Promise = require('./source/3.promise');

new Promise((resolve,reject) => {
 resolve('success')   
}).then(res => {
    console.log('成功1',res)
    // 当没有返回值的情况，即 对应的是：return undefined; 执行下一个 promise 的成功
},err => {
    console.log('失败1',err)
}).then(res => {
    console.log('成功2',res) // '成功2' undefined

    throw new Error(); // 执行下一个 promise 的失败, => 失败3
},err => {
    console.log('失败2',err)
}).then(res => {
    console.log('成功3',res)
},err => {
    console.log('失败3',err)
})

// 成功1 success
// 成功2 undefined
// 失败3