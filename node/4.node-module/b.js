// require('./a.js');
// console.log(global) // 此时 global 上有 c: 2
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function Module(id){
    this.id = id;
    this.exports = {};
}

// 对结果进行缓存


// 给文件路径 添加后缀
/** js 策略，json 策略 */
Module._extensions = {
    // js 变成一个函数执行，然后再把值传出去
    '.js'(module){
        let script = fs.readFileSync(module.id,'utf8');
        let templateFn = `(function(exports,module,require,__dirname,__filename){${script}})`
        let fn = vm.runInThisContext(templateFn);    
        let exports = module.exports;
        let thisVal = exports; // this = module.exports = exports
        let filename = module.id;
        let dirname = path.dirname(filename);

        // call 对作用，1. 改变this指向，2.让函数执行
        fn.call(thisVal,exports,module,req,dirname,filename); // 
    },
    '.json'(module){
        // 读取到json文件，将内容直接返回
        let script = fs.readFileSync(module.id,'utf8');
        module.exports = JSON.parse(script);
    }
}

// ---------- 1. 给个文件的名字，返回文件的绝对路径 -----------
Module._resolveFilename = function(id){
    let filePath = path.resolve(__dirname,id)
    let isExist = fs.existsSync(filePath);

    if(isExist) return filePath;

    // 尝试添加后缀
    let keys = Object.keys(Module._extensions);
    for(let i = 0;i < keys.length;i++){
        let _newPath = `${filePath}${keys[i]}`
        if(fs.existsSync(_newPath)) return _newPath;
    }
    throw new Error('module not found')
}

Module.prototype.load = function(){
    // 获取文件后缀名
    let ext = path.extname(this.id)
    // 不同的文件采用不同的策略
    Module._extensions[ext](this)
}

Module._cache = {}

function req(filename){
    // 1. 创造一个绝对引用地址，方便后续读取
    filename = Module._resolveFilename(filename); 
    
    // ++++++
    let catceModule = Module._cache[filename]
    if(catceModule) return catceModule.exports; // 直接将上次缓存对模块丢给你就ok了

    // 2. 根据绝对路径，创造一个模块
    const module = new Module(filename);
    
    // 最终，缓存模块，根据文件名来缓存
    Module._cache[filename] = module;
    
    // 3. 让用户给module.exports赋值
    module.load();

    return module.exports; // 默认是空对象
}

let a = req('./a.js');
console.log(a);


/**
 * 1. require方法 -》 Module.prototype.require 方法
 * 2. Module._resolveFilename 
 *   - 2.1 方法就是把路径变成了绝对路径，
 *   - 2.2 添加后缀名(.js, .json) 
 * 3. new Module 拿到绝对路径，创造一个模块 this.id     exports = {}
 * 4. Module.load 对模块进行加载(读取文件)
 * 5. 根据文件后缀 Module._extension['.js'] 去做策略加载
 * 6. 用的是同步读取文件
 * 7. 增加一个函数的壳子，并且让函数执行，让module.exports作为了this
 * 8. 用户会默认拿到module.exports的返回结果
 * 
 * 这么做的目的就是，把内容拿到，加上一个函数，让每一个 module.exports 都有自己的作用域
 */