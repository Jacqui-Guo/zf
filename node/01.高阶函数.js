function core(...args) {
    console.log('我是core函数',args)
}

Function.prototype.before = function(cb) {
    // 在这里 谁调用的 before 函数，this 指向的就是谁
    return (...args) => { // 作为函数参数 称为剩余运算法
       cb();
       this(...args); // 调用函数时传递的参数，称为拓展运算符
   }
}

let newCore = core.before(()=>{
    console.log(123);
})

newCore('hello','world');

/**
 * 高阶函数：
 *  - 一个函数返回一个函数
 *  - 一个函数的参数，可以接收一个函数
 * 满足上面条件的任一均可
 */

/**
 * 闭包定义？
 *     - 一个函数定义的作用域和执行的作用域不再同一个，肯定会出现闭包 
 * 
 */ 