Promise.prototype.finally = function(cb){
    return this.then(res=>{
        return Promise.resolve(cb()).then(n=>{
            return res;
        })
    },err=>{
        return Promise.resolve(cb()).then(e=>{throw err})
    })
}

let promise = new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('成功1')
    }, 1000);
}).finally((data)=>{
    console.log('finally',data)
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            // resolve('123')
            reject('失败')
        }, 1500);
    })
}).then(res=>{
    console.log('1',res)
}).then(res=>{
    console.log('2',res)
})

// finally 中是 resolve
// 1 秒钟 之后，输出 finally undefined
// 1.5 秒钟之后，使出 1 成功1
// 2 undefined

// finally 中是 reject

// 1 秒钟 之后，输出 finally undefined
// 1.5 秒钟之后 报错