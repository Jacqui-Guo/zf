/**
 * Promise.all() Promise.finally()
 * 
 * 多个promise全部完成后获取结果，但是其中的某个如果失败额，那么这个promise就失败了
 * 
 * 
 */


// 同步 (同一时刻拿到) 多个异步请求的结果

Promise.all = function(promises){
    return new Promise((resolve,reject)=>{
        let result = [];
        let times = 0;
        const resolveSuccess = (index,data) =>{
            result[index] = data;
            // if(result.length === promises.length){
            //  这样判断是不对的，如果最后一个先成功了 
            //  如果给result第100项赋值 result[100]=1 ，此时result的长度为101
            // }
            if(++times === promises.length){
                resolve(result)
            } 
        }

        for(let i = 0;i < promises.length;i++){
            let _p = promises[i]
            // 如果拿到的值不是promise，是一个普通值，则直接将结果放到数组中
            if(_p && typeof _p.then === 'function'){ // 当前值是一个promise
                _p.then(data=>{
                    resolveSuccess(i,data)
                },reject) // 如果其中某一个promise失败了，则直接执行失败即可
            } else { // 普通值
                resolveSuccess(i,_p) 
            }
        }
    })
}

 
Promise.all([1,2,3,new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('成功')
    }, 1000);
}),new Promise((resolve,reject)=>{
    setTimeout(() => {
        reject('失败')
    }, 1500);
})]).then(data => {
    // data 是一个数组
    console.log('success',data);
}).catch(err =>{
    console.log('err',err);
})