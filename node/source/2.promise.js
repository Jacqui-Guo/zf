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
        if(this.status == PENDING){
            /**  订阅 */
            // 写法一： 切片变成 AOP
            this.onFulfilledCallbacks.push(()=> {
                // todo....
                onFulfilled(this.value);
            })
            // 写法二：如果这种，函数调用的时候，没有办法传递this.value参数
            // this.onFulfilledCallbacks.push(onFulfilled(this.value));

            this.onRejectedCallbacks.push(()=>{
                onRejected(this.reason);
            })
        }

        if(this.status == FULFILLED){ // 成功调用成功方法
            onFulfilled(this.value);
        }
        if(this.status === REJECTED){ // 失败调用失败方法
            onRejected(this.reason);
        }
    }
}

module.exports = Promise;