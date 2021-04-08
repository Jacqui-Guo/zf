// 回掉函数 setTimeout / fs.readFile... 回掉函数 有 回掉地狱的问题
// promise 内部只是优化了一个 并没有完全解决回掉地狱
// generator 可以把函数的执行权 交出去 * / yield
// async + await 基于generator, (async + await就是语法糖)
// yield 产出

// 核心靠的是 switch case 来实现的

// function * read(){ // 生成器， 他执行的结果叫迭代器
//     console.log(1);
//     yield 1;
//     console.log(2);
//     yield 2;
//     console.log(3);
//     yield 3;
// }

// let it = read(); // 迭代器 默认没有执行
// it.next()

// a.txt-》 b.txt-》 b
const util = require('util');
const fs = require('fs');

let readFile = util.promisify(fs.readFile)

// 写法一： --------------------------------------

// let it = read();
// let {value,done} = it.next(); // value 就是 yiled 后面的返回值
// value.then(data=>{
//     // console.log('xxx',data); // b.txt
//     let {value,done} = it.next(data)
//     value.then(data=>{
//         // console.log('---',data); //
//         let {value,done} = it.next(data); // 此时的 value 就是最终的返回结果
//         // console.log('res',value);
//     })
// })

// 上面的代码有点不忍直视

// 写法二： --------------------------------------
// TJ库中有个 co 库

// npm install co
// const co = require('co');

// 手写一个 co
function co(it){
    // 异步的迭代 只能用函数递归的方法
    return new Promise((resolve,reject)=>{
        function next(data){
            let {value,done} = it.next(data);
            if(done){ // 如果执行完毕，完成
                resolve(data)
            } else {
                Promise.resolve(value).then(data=>{
                    next
                },err=>{
                    reject(err)
                })
                // 原生的promise有优化，如果是promise 内部会直接把promise返回
                // Promise.resolve(value).then(next,reject)
                
            }
        }
        next()

        // 第一次调用next函数，不传递值的原因，
        //当前 next 传递的数据，默认赋值给了 上一次 next 函数被调用时的执行结果

        // let a = next('a'); console.log(a) 输出 b 
        // let b = next('b'); console.log(b) 输出 undefined
    })
}

// co(read()).then(data=>{
//     console.log(data);
// })


// generator + co 让代码看起来更像同步，但是需要 co 库
// * 变成 async, yield 变成 await

// function * read(){
//     let data = yield readFile('./a.txt','utf8'); // 默认路径是项目根目录
//     data = yield readFile(data,'utf8');
//     return data;
// }


// 写法三： --------------------------------------
// async，await 的实现原理： 就是generator + co 的语法糖
async function read(){
    let data = await readFile('./a.txt','utf8'); // 默认路径是项目根目录
    data = await readFile(data,'utf8');
    return data;
}

read().then(res=>{
    console.log(res)
})