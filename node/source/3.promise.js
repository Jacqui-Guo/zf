// 1、解决链式调用
// 2、解决链式调用过程中的异步

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
// 利用 x 的值 来判断调用的是 promise2 的resolve还是reject
function resolvePromise(promise2,x,resolve,reject) {
    
    // 情况一：promise 的返回值是一个新的promise的情况
    if(promise2 === x) { 
        return reject(new TypeError('错误'));
    }

    // 情况二：我可能写的promise 要和别人写的promise兼容，考虑不是自己写的promise的情况
    // 判断promise返回值是 {} 或 function 的情况
    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
        // 处理别人的promise调用成功之后还能再次调用的失败的情况，确保 promise 符合规范 
        let called = false;
        try{
            // promise 中嵌套 promise 的情况
            let then = x.then;
            if(typeof then === 'function'){
                // promise.then(success=>{},err=>{})
                then.call(x,resolveCb =>{
                    if(called) return;
                    called = true;

                    resolvePromise(promise2,resolveCb,resolve,reject); // 直到解析到不是promise为止
                    // resolve(resolveCb)
                },rejectCb=>{
                    if(called) return;
                    called = true;

                    reject(rejectCb);
                })
            } else { // {} 或者 {then:xxx}
                resolve(x);
            }
        } catch(e) {
            if(called) return;
            called = true;

            reject(e)
        }

    } else { // 普通值的情况
        resolve(x);
    }

}

class Promise{
    constructor(exectutor) {
        this.status = PENDING; // promise 的状态
        this.value = undefined; // 成功的原因
        this.reason = undefined; // 失败的原因

        this.onFulfilledCallbacks = []; // 存储成功态函数
        this.onRejectedCallbacks = []; // 存储失败态函数

        const resolve = (value) => {
            // 需要考虑 resolve(new Promise(resolve(){},reject(){})) 这种情况
            if(value instanceof Promise) {
                return value.then(resolve,reject);
            }    
            
            if(this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                // 发布
                this.onFulfilledCallbacks.forEach(fn=>fn())
            }
        }

        const reject = (reason) => {
            if(this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason;

                this.onRejectedCallbacks.forEach(fn=>fn());
            }
        }

        try {
            exectutor(resolve,reject)
        } catch (e) {
            reject(e)
        }   
    }

    then(onFulfilled,onRejected) {
       // then() 函数中，不传递参数的情况
       // 如果不传递参数的话，就返回一个函数，接收上一个函数的默认返回值，传递给下一个函数
       onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v=>v; 
       onRejected = typeof onRejected === 'function' ? onRejected :  err => { throw err; }
       
        // 每当 promise 执行成功之后，都会返回一个新的promise
        let promise2 = new Promise((resolve,reject)=>{
            
            if(this.status == FULFILLED){ // 成功调用成功方法
                // 加定时器的目的是为了确保 promise2 值存在，new Promise 实例话完成 
                setTimeout(()=>{
                    try {
                        let x = onFulfilled(this.value);
                        // resolve(x);
    
                        // 处理 promise 中嵌套 promise 的情况
                        resolvePromise(promise2,x,resolve,reject);
    
                    } catch(e){
                        reject(e);
                    }
                },0)
            }
            if(this.status === REJECTED){ // 失败调用失败方法
                setTimeout(()=>{
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2,x,resolve,reject);// 只要返回的是一个普通值，走的都是 resolve
                    }catch(e){
                        reject(e);
                    }
                },0)
            }

            if(this.status == PENDING){
                /**  订阅 */
                // 写法一： 切片变成 AOP
                this.onFulfilledCallbacks.push(()=> {
                    // todo....
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            // resolve(x);
                            resolvePromise(promise2,x,resolve,reject);
                        } catch(e){
                            reject(e);
                        }
                    }, 0);
                })
                this.onRejectedCallbacks.push(()=>{
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject); // 只要返回的是一个普通值，走的都是 resolve
                        }catch(e){
                            reject(e);
                        }
                    }, 0);
                })
            }
        })
        return promise2;
    }

    // Promise.resolve() 静态方法 一上来就执行成功的promise
    static resolve(value){
        return new Promise(resolve=>{
            resolve(value)
        })
    }

    // 处理.catch() 单独写的情况  (catch方法就是没有成功的失败)
    static catch(errorFn){
        return this.then(null,errorFn)
    }

}

/**
 * 测试 dfd 对象上的 promise,resolve,reject 是否符合规范
 */

// 延迟对象，帮我们减少一次套用，针对目前来说，应用不是很广泛 
Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}


module.exports = Promise;