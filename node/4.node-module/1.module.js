/**
 * 模块的分类
 *  1. 核心模块 内置模块(node中自带的模块 fs,http,vm....)
 *  2. 文件模块，别人饮用的时候需要通过相对路径或者绝对路径来饮用
 * 
 * 
 */

/**
 * node 中自己实现了一个模块 vm 不受影响 (沙箱环境)  
 * 
 * 如何用js实现一个沙箱？
 *  - 快照 (执行前记录信息，执行后还原信息) 通过 proxy 来实现 
 */ 

global.a = 100;
new Function('b',`console.log(a,b)`)('b');  // 输出： 100 b
console.log(global)

// var a = 100; // 此时 a 不是 全局的 (a与下面的函数，属于平级的关系)
// new Function('b',`console.log(a,b)`)('b');  // undefined b

/**
 * require 的实现
 *  1. 读取文件
 *  2. 读取到后给文件包装一个函数
 *  3. 通过runInThisContext 将他变成js语法
 *  4. 调用
 */

/**
 * node 中代码调试
 * ---- 方法一： 使用vscode的方式 
 *  1. 点击左侧 debugger
 *  2. 点击 运行和调试 下面的 创建 launch.json 文件
 *  3. 选择工作目录，环境(这里我选择的是node)
 *  4. 可以看到在工作目录下 出现 .vscode/launch.json
 *  5. 切换到 debugger -》在顶部有运行的小图标，点击运行
 *  5. 在相应的要调试的js文件上，打上断点
 * 
 * --- 方法二：在chrome中进行调试
 *  1. 在当前目录，打开命令行工具 
 *  2. 输入 node --inspect-brk youFileName.js
 *  3. chrome://inspect/#devices
 *  4. 点击底部的 ispect
 * 
 * --- 方法三：在命令行中进行调试(基本用不到)
 */ 

//  module.exports = 'hello';
//  exports：
//     exports.a = xxx; 
//     exports.b = xxxx; 
//  this：当前模块的导出对象

let exports = module.exports = {}
// exports 就是 module.exports 一个别名，起到了简化的作用
// 如果有多个方法，想要一个个导出，可以采用 exports 

exports.a = 1;
module.exports.b = 2;

exports.fn1 = function(){

}
exports.fn2 = function(){
    
}

module.exports = {
    fn1(){},
    fn2(){}
}
