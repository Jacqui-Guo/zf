/**
* 1、promise是一个类，无需考虑兼容性
* 2、当前 executor 给了两个函数，可以来描述当前promise的状态，promise 有三个状态：成功态，失败态，等待态
*/
let Promise = require('./source/2.promise.js')

let promise = new Promise((resolve,reject) => {
    // 状态为 pending , 1秒钟之后状态改为 fulfilled, rejected

    /**
     *  - 状态为 pending 时
     *  1、需要把状态触发的函数存储起来，
     *  2、当状态发生改变，触发对应的函数执行
     * 
     * 这个过程就是发布订阅
     */


    setTimeout(() => {
     resolve('成功')
   },1000)
}) 

promise.then(res => {
   console.log('success',res);
},err => {
   console.log('fail',err);
})