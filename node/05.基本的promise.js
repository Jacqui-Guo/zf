/**
* 1、promise是一个类，无需考虑兼容性
* 2、当前 executor 给了两个函数，可以来描述当前promise的状态，promise 有三个状态：成功态，失败态，等待态
*/
let Promise = require('./source/1.promise.js')

let promise = new Promise((resolve,reject) => {
   console.log(1);
   // reject('失败')
   resolve('成功')
}) 

promise.then(res => {
   console.log('success',res);
},err => {
   console.log('fail',err);
})