// 1、解决链式调用
// 2、解决链式调用过程中的异步

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise{
    constructor(exectutor) {
        this.status = PENDING; // promise 的状态
        this.value = undefined; // 成功的原因
        this.reason = undefined; // 失败的原因

        this.onFulfilledCallbacks = []; // 存储成功态函数
        this.onRejectedCallbacks = []; // 存储失败态函数

        const resolve = (value) => {
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
        // 每当 promise 执行成功之后，都会返回一个新的promise
        return new Promise((resolve,reject)=>{
            
            if(this.status == FULFILLED){ // 成功调用成功方法
                try {
                    let x = onFulfilled(this.value);
                    resolve(x);
                } catch(e){
                    reject(e);
                }
            }
            if(this.status === REJECTED){ // 失败调用失败方法
                try {
                    let x = onRejected(this.reason);
                    resolve(x); // 只要返回的是一个普通值，走的都是 resolve
                }catch(e){
                    reject(e);
                }
            }

            if(this.status == PENDING){
                /**  订阅 */
                // 写法一： 切片变成 AOP
                this.onFulfilledCallbacks.push(()=> {
                    // todo....
                    try {
                        let x = onFulfilled(this.value);
                        resolve(x);
                    } catch(e){
                        reject(e);
                    }
                })
                this.onRejectedCallbacks.push(()=>{
                    try {
                        let x = onRejected(this.reason);
                        resolve(x); // 只要返回的是一个普通值，走的都是 resolve
                    }catch(e){
                        reject(e);
                    }
                })
            }
        })
        
    }
}

module.exports = Promise;