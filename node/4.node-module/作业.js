// 1  同一个promise只能改变一次状态
let p = new Promise(function(resolve, reject) {
    reject();
    resolve();
})
p.then(function() {
    console.log('成功')
}, function() {
    console.log('失败')
})
// 失败

// 2
const promise = new Promise((resolve, reject) => {
    console.log(1)
    resolve() // resolve 和 reject 没有终止代码执行的功能
    console.log(2)
})
promise.then(() => {
    console.log(3)
});
// 1 2 3

// 3 
Promise.resolve(1) 
    .then(res => 2)
    .catch(err => 3) 
    .then(res => console.log(res));
// 2

// 4 
Promise.resolve(1)
    .then((x) => x + 1) // 2
    .then((x) => { throw new Error('My Error') })
    .catch(()=>1) // catch 中返回普通值会作为下一次的成功
    .catch(() => {throw 'xxx'}) 
    .then((x) => x + 1)
    .then((x) => console.log(x)) // 2
.catch(console.error) // xxx
// 2

// 5 ?
async function async1() {
    console.log('async1 start'); 
    await async2();  // async2.then(()=>{ console.log('async-next') })
    console.log('async-next') // 会被放到微任务队列中 
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function() { // 放入宏任务队列
    console.log('setTimeout');
}, 0);
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2'); // 会被放到微任务队列中 
});
console.log('script end');
// script start, async1 start, async2，promise1，script end，async-next，promise2，setTimeout

// async 返回的是一个promise, await 相当于yield + co, await 调用 then 方法，做了一次

/**
 * 宏任务每次执行的时候，都会产生一个新的微任务队列，
 * 
 */

// 6  js 规范 ? 
Promise.resolve().then(() => { // then1
    console.log('then1');
    Promise.resolve().then(() => {
        console.log('then1-1');
        return Promise.resolve(); // 如果then中的方法返回了一个promise 会发生什么？  x.then().then()
        // 如果return了一个promise，会额外再开辟一个异步方法(相当于多了一次then)
    }).then(() => {
        console.log('then1-2')
    })
}).then(() => {
    console.log('then2');
})
.then(() => {
    console.log('then3');
})
.then(() => {
    console.log('then4');
})
.then(() => {
    console.log('then5');
})

// [then1，then1-1，then2，x.then，then3, x.then.then,then4,then1-2,then5]
