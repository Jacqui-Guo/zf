/**
 * __dirname: 当前文件执行时的目录 (绝对目录) /Users/wuguangyong/study/珠峰/code/zf/node/3.node
 * __filename: 文件自己的绝对路径 /Users/wuguangyong/study/珠峰/code/zf/node/3.node/1.js
 * 
 * process:  
 *   1. platform 平台
 *   2. chdir 
 *   3. cwd  (current working directory) 当前工作目录 (可以手动改变 cwd 值)
 *   4. env (执行代码时传入的环境)
 *   5. argv (执行代码时传入的参数)
 *   6. nextTick node中自己实现的，不属于node中Eventloop, 优先级比promise更高
 */

const { requiredOption } = require("commander");

 // [执行node所在的exe文件，当前执行的文件，...其它参数]
// console.log(process.argv);

// commander 命令行管家 npm install commander
// github -> search commander 

// const {program} = require('commander');
// program.parse(process.argv)

// console.log(program);

// nextTick 优先级高于 promise

Promise.resolve().then(()=>{
    console.log('promise');
})
process.nextTick(()=>{ // nexttick 位于当前执行栈的底部
    console.log('next-tick');
})

// next-tick
// promise

/**
 * - global 上有属性直接访问的叫全局属性
 * - require, exports, module 也可以直接访问，他们不在global上
 * - 每个文件都是一个模块，模块化的实现借助的是 函数
 * 
 */

// 每个文件都是一个模块，模块化的实现借助的是 函数
// 函数中有参数，参数里面有五个属性

/**
 * 为什么要有模块化？
 *  - 为了解决命名冲突问题(单例模式 不能完全解决这些问题)
 *  - 用文件查分的方式，配合iife 自治性函数来解决
 *  - 前端里会有请求的问题，依赖问题
 *  - umd 兼容 amd,cmd,commonjs 但是不支持es6模块
 * 模块化规范： commonjs规范，amd,cmd, esm 模块
 * 
 */

/**
 * commonjs 规范 (commonjs只是一个规范) ---- 基于文件读写的，如果依赖了某个文件，我回进行文件读取 (是动态的，当某个条件满足，我就require这个文件)
 *  我想使用这个模块，我就 require
 *  我想把模块给别人用 module.exports 导出
 * 
 * esModule 规范 (每次你饮用一个模块，发请求 --- 静态的) ==》目前是不依赖与发请求的方式，而是靠webpack编译
 *  别人要用我，我就需要 export
 *  我要用别人，我就import
 */ 

 // 这样写是不允许的
 if(true){
    import xxx from './xxx'
 }

 // 这种写法可以 (动态，指的就是下面这种代码的情况)
 if(true){
    require('./xxxx')
 }

