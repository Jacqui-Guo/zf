const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';


class Promise{
    constructor(exectutor) {
        this.status = PENDING; // promise 的状态
        this.value = undefined; // 成功的原因
        this.reason = undefined; // 失败的原因

        const resolve = (value) => {
            if(this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
            }
            
        }

        const reject = (reason) => {
            if(this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason;
            }
        }

        try {
            exectutor(resolve,reject)
        } catch (e) {
            reject(e)
        }   
    }

    then(onFulfilled,onRejected) {
        if(this.status == FULFILLED){ // 成功调用成功方法
            onFulfilled(this.value);
        }
        if(this.status === REJECTED){ // 失败调用失败方法
            onRejected(this.reason);
        }
    }
}

module.exports = Promise;

// export default {
//     Promise
// }