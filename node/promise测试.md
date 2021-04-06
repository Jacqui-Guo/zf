1. `https://promisesaplus.com/` 最底部 `Compliance Tests` 规范测试
2. 测试需要有一个入口文件，这里选择 3.promise.js
   ```js
   // 测试 dfd 对象上的 promise,resolve,reject 是否符合规范
   Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
   }
   ``` 
3. `npm install promises-aplus-tests -g`
4. 在当前要测试的文件目录下打开终端： promises-aplus-tests yourProjectName.js
5. 会测试当前自己写的promise是否符合规范