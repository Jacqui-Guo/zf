经典面试题：

[[1,2,3],[4,5,6]] 数组展开

```js
let res = [[1,2,3],[4,5,6]].reduce((prev,next) => {
    return [...prev,...next]
})
console.log(res); //[1,2,3,4,5,6]
```

##### reduce

> reduce方法使用的前提是数组不能为空

手写reduce函数

```js
Array.prototype.myReduce = function(fn,prev) {
  for(let i = 0;i < this.length;i++) {
    if(typeof prev === 'undefined') {
      prev = fn(this[i],this[i+1],i+1,this);
      i++; // 在第一次循环之后prev不再是undefined,所有会走else中的内容
    } else {
      prev = fn(prev,this[i],i,this)
    }
  }
  return prev;
}

let res = [1,2,3,4].myReduce((prev,current,index,arr) => {
  return prev + current 
})
console.log('result',res); // 10
```



##### forEach

手写数组的forEach函数

```js
Array.prototype.forEach = function(fn) {
    for(let i = 0;i<this.length;i++) {
        fn(this[i],i)
    }    
};
[1,2,3].forEach((item,index) => {
    console.log(item,index);
})
```

##### set

> 值不重复

```js
let arr = [1,2,3,4,2,8];
let set = new Set(arr); // 得到一个set集合
console.log([...set]); // [1, 2, 3, 4, 8]   

```



##### map

>不能有重复的key 并且 map的key可以使用对象类型 
>
>map 有返回值，返回一个新 数组
>
>在forEach中写return是不起作用的

```js
Array.prototype.map = function(fn) {
    let newArr = [];
    for(let i = 0;i<this.length;i++) {
        newArr.push(fn(this[i],i,this))
    }
    return newArr;
}
let newArr = [1,2,3].map((value,index,ary) => {
    return value * 2
})
console.log(newArr); // [2,4,6]
```

##### filter

> filter 根据指定的条件对数组进行过滤，也会返回一个新数组

```js
Array.prototype.filter = function(fn) {
    let newArr = [];
    for(let i = 0;i<this.length;i++) {
        fn(this[i],i) ? newArr.push(this[i]) : '';
    }
    return newArr;
}
let arr = [1,2,3].filter((value,index) => {
    return value < 3;
})
console.log(arr); // [1,2]
```

##### find

> 返回查找的那一项 找到后就不会继续查找了，没有返回underfined

```js
let res = [1,2,3].find(item => {
    return item < 3
})
console.log(res); // 1
```

##### some

> 找到满足条件的元素，找到返回true (找到了就返回，不再向下查找了)

```js
let res = [1,2,3].some(item => {
    return item > 2
})
console.log(res); // true
```

##### every

> 查找不满足条件的元素是否存在, 查找到不满足条件的元素返回false

```js
let res = [1,2,3].every(item => {
    return item < 1
})
console.log(res); // false
```

##### includes

> 判断数组中是否包含指定的元素

```js
[1,2,3].includes(0) // false
[1,2,3].includes(1) // true
```

##### Array.from()

> 将类(伪)数组转化为数组

伪数组和数组的区别是：伪数组没有length属性

```js
function a() {
    console.log(Array.from(arguments)); // [1,2,3,4]
}
a(1,2,3,4);
```

### 函数常见的方法

##### Object.assign(); 

> 浅拷贝

```js
let obj1 = {name: 'zs'}
let obj2 = {age: 20}
let obj = Object.assign(obj1,obj2); // 和es6中的解构赋值功能相同 {...obj1,...obj2}
console.log(obj)
```

##### Object.setPrototypeOf()

> 设置对象原型上的数据

```js
let obj1 = {name: 'zs'}
let obj2 = {age: 20}

Object.setPrototypeOf(obj1,obj2);
// obj1 = {
//     name: 'zs',
//     __proto__: {
//         age: 20
//     }
// }

Object.getPrototypeOf(obj1); // 获取obj1身上 __proto__ 对应的数据

输出：{age:20}
```

### Promise

> Promise只有一个参数，叫executor执行器，默认new时就会调用

```js
let p = new Promise((resolve,reject) => {
  	resolve('success')
    reject('error');
})
p.then(res => {
  console.log('success');	
},err => {
  console.log('error');
})
```

#### Promise.all()

> 并发的

```js
Promise.all 方法调用后会返回一个新的promise

Promise.all([methods1,methods2,,,]).then(([res1,res2]) => {
  
}).catch(err => {
  console.log('请求失败');
})
```

#### Promise.race()

> 同时发送多个网络请求，其中一个请求成功了，就执行 .then 方法
>
> 处理多个请求，只取最快的

```js
Promise.race([methods1,methods2,....]).then(data => {
  
}).catch(err => {
   console.log('请求失败');
})
```

# 手写vue3.0源码

#### vue3与vue2的区别

1. vue3源码采用 `monrepo` 

2. vue2后期引入`rfc` 使每个版本可控

3. `Vue3` 劫持数据采用proxy `Vue2` 劫持数据采用`defineProperty`。 `defineProperty`有性能问题和缺陷

   > defineProperty 会把一个对象进行完整的递归，完了给每个属性添加get和set
   >
   > Vue3 采用proxy, 它不需要改写属性的get, set 也不用一上来就递归，而是当使用到某一层的时候才进行处理

### 手写根据需要打包的信息进行 打包

1. 工作空间 `workspaces` 在 `packages/*`

2. `reactivity` 响应式模块 -> 新建包的入口文件index.ts -> 配置包的配置文件

   ```js
   // 每个模块是个包
   {
     "name": "@vue/reactivity",
     "version": "1.0.0",
     "main": "index.js", // 给(node)commonJS使用的
     "module": "dist/reactivity.esm-bundler.js", // 给webpack使用的，默认查找
     "license": "MIT",
     "buildOptions": { // 打包自定义属性
       "name": "VueReactivity", // 打包出的全局模块的名字
       "formats": [ // 当前模块可以构建 node,esm,全局模块，下面的参数是给rollup使用的
         "cjs", 
         "esm-bundler",
         "global"
       ]
     }
   }
   ```

3. `shared`共享模块

4. 在根目录的`packages.json` 文件中，配置打包命令

   ```js
   "scripts": {
      "dev": "node scripts/dev.js",
      "build":"node scripts/build.js"
   }
   ```

5. 在根目录新建用于构建打包的文件 `srcipts/build.js ` `srcipts/dev.js`

   ```js
   build.js 把packages目录下的所有包都进行打包
   1、先获取到packages目录下的所有文件
   2、对获取到的文件进行打包
   
   const fs = require('fs');
   const execa = require('execa'); // 开启一个子进程 进行打包  最终还是使用rollup进行打包
   
   // 同步读取当前目录下的某个文件 并过滤掉除文件夹之外的文件
   const targets = fs.readdirSync('packages').filter(f => {
       if(!fs.statSync(`packages/${f}`).isDirectory()) { // 判断packages目录下的文件是不是文件夹
           return false;
       }
       return true;
   });
   
   // 对目标进行依次打包 并行打包
   // console.log(targets);
   
   async function build(target) {
       /**
        * 参数一：rollup 使用rollup进行打包 
        * 参数二: ['-c','--environment','`TARGET:${target}`'] 1、采用某个配置文件进行打包   2、采用环境变量来进行打包 3、打包的目标
        * 参数三: 把node子进程打包的信息共享给父进程
        */
       await execa('rollup',['-c','--environment',`TARGET:${target}`],{stdio: 'inherit'}); //  
   }
   function runParallel(targets,interatorFn) { // 打包目标， 迭代函数
       const res = [];
       for(const item of targets) {
           const p = interatorFn(item);
           res.push(p);
       }
       return Promise.all(res);
   }
   
   runParallel(targets,build); // parallel
   ```

   ```js
   dev.js
   // 只针对具体的某个包打包
   
   const fs = require('fs');
   const execa = require('execa'); // 开启一个子进程 进行打包  最终还是使用rollup进行打包
   
   async function build(target) {
       /**
        * 参数一：rollup 使用rollup进行打包 
        * 参数二: ['-c','--environment','`TARGET:${target}`'] 
        *  1、-c 采用某个配置文件进行打包   或者是 -cw 一直监控打包的文件的变化
        *  2、--environment 采用环境变量来进行打包 
        *  3、打包的目标
        * 参数三: 把node子进程打包的信息共享给父进程
        */
       await execa('rollup',['-cw','--environment',`TARGET:${target}`],{stdio: 'inherit'}); 
   }
   // dev 打包的时候只针对具体的某个文件，进行打包
   const target = 'reactivity';
   build(target);
   ```

6. 配置rollup相关的配置 在项目根目录下新建 `rollup.config.js`

   ```js
   /**
   * 1、找到需要打包的packages.json 文件
   * 2、配置打包文件的输出路径
   * 3、
   */
   
   // rollup 的配置 每次打包都会走这个配置
   // rollup最终需要导出一个配置变量
   import path from 'path';
   import json from '@rollup/plugin-json'; // 解析json的插件
   import resolvePlugin from "@rollup/plugin-node-resolve"; // 解析resolve的插件
   import ts from 'rollup-plugin-typescript2';
   
   // 根据环境变量中的target属性 获取对应模块中的package.json
   
   /**
    * 1、先找到文件目录  
    * 2、找到要打包的某个包 process.env.TARGET
    * 3、去当前目录下找到packages.json
    */
   +++++++++++ 目的是找到需要打包的packages.json 文件 ++++++++++++
   const packagesDir = path.resolve(__dirname,'packages'); // 找到packages
   const packageDir = path.resolve(packagesDir,process.env.TARGET); // 找到要打包的某个包
   
   // 永远针对的是某个模块
   const resolve = (p) => path.resolve(packageDir,p)
   
   const pkg = require(resolve('package.json')); // packages.json 文件
   
   
   // 执行 yarn run build 可以输出 要打包文件 配置文件的内容
   // console.log('rollup-config',pkg);
   
   // 对打包类型，先做一个映射表 根据你提供的formats来格式化需要打包的内容
   
   /**
    * 打包之后文件的输出目录：
    *    需要打包的文件目录下的dist目录   
    *    打包之后的文件名  "module": "dist/shared.esm-bundler.js",
    */
   
   const name =  path.basename(packageDir);
   
   const outputConfig = { // 自定义的
       'esm-bundler': {
           file: resolve(`dist/${name}.esm-bundler.js`),
           format: 'es'
       },
       'cjs': {
           file: resolve(`dist/${name}.cjs.js`),
           format: 'cjs'
       },
       'global': {
           file: resolve(`dist/${name}.global.js`),
           format: 'iife' // 立即执行函数
       }
   } 
   const options = pkg.buildOptions;
   
   function createConfig(format,output) {
       output.name = options.name;
       output.sourcemap = true;
       // 生成rollup配置
       return {
           input: resolve(`src/index.ts`), // 打包文件的入口文件
           output, // 打包输出文件路径
           plugins: [
               json(),
               resolvePlugin(), // 解析第三方模块
               ts({ // ts要用的话，必须要有一个ts.config.js 执行 npx tsc --init (执行这个命令其实就是执行node_modules/bin/tsc 这个命令)
                   tsconfig: path.resolve(__dirname,'tsconfig.json')
               }), 
           ]
       }
   }
   
   export default options.formats.map(format => createConfig(format,outputConfig[format]))
   ```

7. 执行`npx tsc --init` 在根目录生成 `tsconfig.json` 文件

   ```js
   需要在tsconfig.json文件中进行如下配置
   "moduleResolution": "node",
   "baseUrl": ".",
   "paths": { /* 做一个路径映射表 */
      "@vue/*": [
         "packages/*/src"
      ] 
    }  
   ```

#### 三种模式的区别

* esm：说明是一个es6模块
* cjs：cjs node模式
* global：全局浏览器环境下引用的

#### 当执行`yarn install` 发生了什么

> 把packages目录下所有的包放到node_modules/@vue 目录下(@vue目录下的文件是软链)

```js
之所以放到@vue目录下是因为

packages/directoryName/package.json name字段 自己配置的为 "@vue/directoryName"
```

#### 在packages目录下的`reactivity/src/index.ts`文件 引入其它文件时

> 在不同的模块中引入其它模块

```js
reactivity/scr/index.ts

import {shared} from '@vue/shared';
const Reactivity = {}
export {
    Reactivity
}

需要在tsconfig.json文件中进行如下配置
"moduleResolution": "node",
"baseUrl": ".",
"paths": { /* 做一个路径映射表 */
   "@vue/*": [
      "packages/*/src"
   ] 
 }        
```

#### 软链的作用

> 为了在不同的模块下相互引用

#### Vue 3.0 执行 `npm run dev`

```js
默认打包 packages/vue 这个一个文件夹
```

#### 核心API

> reactive({});   参数是对象

##### reactive

> 将所有的数据都变成响应式的(一个对象不管有多少层，都可以变成响应式的)

```js
想要解构reactive,使用toRefs,解构一个值，使用toRef

let proxy = reactive({name:'zs',age:20});
let {name,age} = toRefs(proxy); 
```

##### shallowReactive

> 希望一个数据只有第一层能变成响应式的

##### readonly

> 属性只能读，不能去修改

##### shallowReadonly

> 数据可读，且只有第一层是只读的(不可以修改的)

```js
使用方法
reactive/shallowReactive/readonly/shallowReadonly({name:'zs'})
```

#### 手写实现⬆️的四个API

```js
/***
 * 1、创建四个函数 reactive(整个数据都是响应式的)，shallowReactive(只有数据的第一层是响应式的)，readonly(数据是只读的)，shallowReadonly(只有第一层数据是只读的)
 * 2、创建一个响应式函数，根据传递的参数不同(target,isReadonly,响应式函数)，实现不同的功能
 *   + 判断拦截的对象是不是object,如果不是，直接返回
 *   + 根据是不是只读的，将target存入到不同的存储栈中
 *   + 存储之前，判断存储栈中是否已经存在过(即是判断当前target是否已经被代理过)，存在直接返回target    
 * 3、
 */
```

#### Proxy使用案例

```js
proxy用于修改某些操作的默认行为，等同于在语言层面做出修改
proxy可以理解为在目标对象前假设一个“拦截”层，外界对该对象的访问都必须先通过这层拦截，因此提供了一种机制可以对外界的访问进行过滤和改写。Proxy这个词的原意是代理，用在这里表示由他来“代理”某些操作，可以翻译为“代理器”.

参数介绍
其中new Peoxy()表示生成一个proxy实例
target参数表示要拦截的目标对象
handler参数也是一个对象，用来定制拦截行为

proxy 的 get 方法，用于拦截某个属性的读取操作
         set 方法，用于拦截属性的赋值操作
         
let proxy = new Proxy({},{
  get:function(target,property){
    return 35;
  },
  set: function(obj,prop,value){
    if(prop === 'age'){
      if(!Number.isInteger(value)){
        throw new TypeError('The age is not an integer')
      }
      if(value > 200){
        throw new RangeError('The age seems invalid');
      }
    }
    //对于age以外的属性,直接保存
    obj[prop] = value;
  }
});
console.log(proxy.name);
console.log(proxy.age = 201); // The age seems invalid

//如果handler没有设置任何拦截，那就等同于直接通向源对象
let target = {};
let handler = {};
let proxy = new Proxy(target,handler);
proxy.a = 'b';
console.log(target.a);  //b
```

#### 手写effect函数

```js
/*
 * 1、effect中所有属性，都会收集effect  （track函数）
 * 2、当这个属性值发生变化的时候，会重新执行effect （trigger函数）
 */
let state = reactive({name:'zs',arr:[1,2,3]})
effect(()=>{
  app.innerHTML = state.arr;
}) 
setTimeOut(() => {
  state.arr[100] = 1;
},1000)

trigger 函数 找属性对应的effect 让其执行 （数组、对象）

```

#### ref

> 如果数据只有一个，并且是基本数据类型，一般使用ref，而不使用reactive

```js
let {ref} = VueReactivity;
// ref 会把普通的类型转换成一个对象，并且这个对象中有一个value属性，指向原来的值
let name = ref('zf');
setTimeOut(() => {
  name.value; // 取值，触发依赖收集 track
  name.value = 'jw'; // 更改数据，会触发trigger
},1000)
```

#### toRef

```js
⚠️注意：toRef没有实现依赖收集，只是做了一层代理
set 修改数据的时候，如果原对象是响应式的，那么就会触发更新
get 获取数据的时候，如果原对象是响应式的，就会进行依赖收集

(判断原数据是否是响应式的，如果是，去原对象上进行修改)
```

#### toRefs

> toRefs就相当于vue3自己实现的响应式解构

```js
实现思路：通过for in 循环toRef

/**
 * 为什么封装toRefs？
 *   toRef一次只能转一个数据
 *   let state = {name:'zs',age: 20};
 *   let r1 = toRef(state,'name');
 *   let r2 = toRef(state,'age');
 *   effect(() => app.innerHTML = r1.name + r2.age) // name 或 age不管谁更新都会触发effect执行    
 */
```





# JS高级

## 常见面试题

1. 如何处理浏览器精准度问题

   ```js
   这是浏览器的bug
   
   0.1+0.2 => 0.30000000000000004
   将数据统一乘以 10 或 100 ，计算得到的结果再除以 10 或 100
   ```

2. `i++ , i=i+1,i+=1 是个是否一样？`

   ```js
   i=i+1 与 i+=1 是一样的
   i++ 返回的一定是数字
   但是 i=i+1 与 i+=1 可能是字符串拼接
   ```

3. 求数组的交集，并集，差集

   ```js
   let arr1 = [1,2,3,4];
   let arr2 = [3,4,5,6];
   
   并集
   let set1 = new Set([...arr1,...arr2]);
   console.log([...set1]) // [1,2,3,4,5,6]
   
   交集
   let set1 = new Set(arr1);
   let set2 = new Set(arr2);
   
   let res = [...set1].filter(item => {
     return set2.has(item)
   })
   console.log(res); // [3,4]
   
   差集
   // 求arr1相对arr2的差集
   let set1 = new Set(arr1);
   let set2 = new Set(arr2);
   
   let res = [...set1].filter(item => {
     return !set2.has(item)
   })
   console.log(res); // [1,2]
   ```

4. 手写深拷贝

   ```js
   const isObject = (o) => typeof o === 'object' && o !== null;
   // WeakMap记录拷贝前和拷贝后的对应关系，避免重复引用
   const deepClone = (obj,hash=new WeakMap) =>{
     if(!isObject(obj)) return obj;
     if(hash.has(obj)) return hash.get(obj); // 返回上次拷贝的结果，不再递归
   
     // let res = Array.isArray(obj) ? [] : {};
     let res = new obj.constructor; // 和上面的写法作用一样
     hash.set(obj,res);
   
     for(const key in obj) {
       /**
        * object.hasOwnProperty 获取对象上除原型之外的所有属性
        */
       if(obj.hasOwnProperty(key)) { // 不拷贝obj上面的原型属性
         res[key] = deepClone(obj[key],hash);
       }
     }
     return res;
   }
   // let obj = {name: 'zs',age:{name:'hello'}};
   
   // 下面这种数据如果不使用weakmap会出现循环引用，堆栈溢出的情况
   let obj = {a:1};
   obj.b = {}; 
   obj.b.a = obj.b;
   let res = deepClone(obj)
   
   console.log(obj,res);
   ```

5. 实现数组扁平化(即将多维数组变为一维数组)

   ```js
   let array = [[1,2,3],4,5,6,[[7]],[]]
   // let result = array.flat(Infinity)
   
   const flatten = (arr) => {
       let res = arr.reduce((prev,current) => {
           return prev.concat(Array.isArray(current) ? flatten(current) : current)
       },[])
       return res;
   }
   console.log(flatten(array)) // [1,2,3,4,5,6,7]
   ```

6. 手动实现compose函数(组合函数)

   > 组合函数实现的关键是,最后一个函数的返回值，作为 (最后一个 - 1) 函数的参数去执行

   ```js
    function sum(a, b) {
      return a + b;
    }
   
   function len(str) {
     return str.length;
   }
   
   function addPrefix(str) {
     return '$' + str;
   }
   let r = addPrefix(len(sum('a','b'))); // '$'+2
   ```

   封装一个函数，实现⬆️

   ```js
   /**
    * 组合函数实现的关键是
    *   最后一个函数的返回值，作为 (最后一个 - 1) 函数的参数去执行
    *   reduceRight[右-》左] 数据计算的顺序和 reduce[从左-》右]计算数据的顺序是相反的
   */
   const compose = (...fns) => {
     return function(...args) {
       console.log(...args,fns);
       let _lastFn = fns.pop(); // 获取最后一个函数 (pop会修改原数组)
       let r = _lastFn(...args);
       return fns.reduceRight((preRes,current) => {
         return current(preRes)
       },r)
     }
   }
   let res = compose(addPrefix,len,sum);
   let a = res('arg1','arg2')
   console.log(a); // '$' 8
   
   
   // 封装函数2
   const compose = (...fns) => {
     return fns.reduce((prev,current) => {
       return (...args) => {
         return prev(current(...args));
       }
     })
   }
   ```

6. xx

   如何实现同一浏览器多个标签页之间的通信

   https://blog.csdn.net/liwenfei123/article/details/79996161

7. 获取数组中重复出现的元素

   ```js
   方式一：
   let arr = [1,2,3,4,1,2,2,2,6,7,6];
   function findRepeatItem(arr) {
     let result = []
     arr.reduce((a,c) => { // 1、a={},c=1 2、a={1:1} c=2 
       // if(a[c]) !result.includes(c) && result.push(c);
       // else a[c]=1;
       // return a
       console.log('---',a,c,result);
       if(a[c]) {
         !result.includes(c) && result.push(c);
       } else {
         a[c] = 1;  // {1:1} {1:1,2:1,3:1,4:1}
       }
       return a;
     }, {});
     return result
   }
   let res = findRepeatItem(arr);
   console.log('---',res); // [1,2,6]
   
   方式二：
   let arr = [1,2,3,4,1,2,2,2,6,7,6];
   function findRepeatItem(arr) {
     let _sortAfterArr = arr.sort()
     let _tmp = new Set();
   
     for(let i = 0;i<_sortAfterArr.length-1;i++) {
       if(arr[i] === arr[i+1]) { 
         _tmp.add(arr[i])
       }
     }
     return [..._tmp];
   }
   let res = findRepeatItem(arr)
   console.log('result',res);// [1,2,6]
   ```

   

8. 

### vue

1. ref和reactive的区别

   ```js
   /**
    * ref和reactive的区别
    *   reactive内部使用的proxy，reactive中传递的参数不是对象，直接返回
    *   ref内部使用的是defineProperty ,因为proxy第一个参数是{}类型 
    */
   ```


2. vue2中不使用 `tree shacking` 的原因

   ```js
   因为vue2中，不知道app对象中的哪些属性被调用了，发生了哪些变化，以及属性的类型也不好推断
   app = {
     data() {
       return {
         a: 1
       }
     },
     methods: {
       xxx: () {}
     }
   }
   ```

3. Vue3 `tree shacking`

   ```js
   let a = 1;
   let b = 2;
   console.log(a);
   
   tree shacking 在代码打包的时候，会把一些没有用到的数据删掉(shacking)
   即用不到的代码 不进行打包
   ```

4. vue3中 `template` 和 `jsx`

   ```js
   template 会做模版的静态分析	
   template 在编译的过程中，会告诉人家，哪些模版是静态的，哪些是动态的
   
   jsx 语法更加灵活，在编译的过程中，少了一些分析的功能
   ```

   

5.  

## 数据类型

### 常见的数据类型

##### Reflect

```js
ES6 后续新增的方法都放在Reflect上 -》 Object

也就是取代Object,一些旧的Object方法，reflect也有，但是新增的方法，之后放在reflect上
```

##### Symbol,Reflect

```js
+ symbol 一般作为对象的key使用

let s1 = Symbol('a')
let obj = {
  name: 'zs',
  age: 20,
  [s1]: 'symbol'
}
symbol 属性默认是不能枚举的(不能进行遍历的)
console.log(Object.getOwnPropertySymbols(obj)); // 获取对象的所有symbol
Object.keys(obj); // 获取对象的所有key

Reflect.ownKeys(obj).forEach(item=>{ // 获取所有的key属性
    console.log(item)
})

Reflect.get  Reflect.set Reflect.delete
```

#### Reflect.apply(target,thisArgument,argumentList)

> **target**：目标函数
>
> **thisArgument**：target函数调用时绑定的this对象
>
> **argumentsList**：target函数调用时传入的实参列表，该参数应该是一个类数组的对象

```js
这个方法类似于：
Function.property.apply.call(target,undefined,argumentsList);

call 的作用：1、是让apply执行，2、改变apply中this指向target
(后面两个参数其实是传递给apply的)

target: 目标函数
第二个参数unefined是 apply 中 this 指向，(target函数调用时绑定的this对象)
第三个参数是：apply调用时，传递给apply的参数列表
```

#### Symbol具有元编程的能力

> 即改写JS本身的功能特性

##### Symbol.toStringTag

> Symbol.toStringTag
>
> 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示**该对象的自定义类型标签**  Object.prototype.toString 方法会去读取这个标签并把它包含在自己的返回值里

```js
let obj = {
  name: 'aaa'
}
Object.prototype.toString.call(obj); // [object object]

let obj = {
  [Symbol.toStringTag]: 'aaa'
}
Object.prototype.toString.call(obj); // [object aaa]
```

##### Symbol.toPrimitive

> 干扰一个对象转换为原始值时的输出结果

```js
// 一个没有提供 Symbol.toPrimitive 属性的对象，参与运算时的输出结果
var obj1 = {};
console.log(+obj1);     // NaN
console.log(`${obj1}`); // "[object Object]"
console.log(obj1 + ""); // "[object Object]"

// 接下面声明一个对象，手动赋予了 Symbol.toPrimitive 属性，再来查看输出结果
var obj2 = {
  [Symbol.toPrimitive](hint) {
    if (hint == "number") {
      return 10;
    }
    if (hint == "string") {
      return "hello";
    }
    return true;
  }
};
console.log(+obj2);     // 10      -- hint 参数值是 "number"
console.log(`${obj2}`); // "hello" -- hint 参数值是 "string"
console.log(obj2 + ""); // "true"  -- hint 参数值是 "default"
```

### 数据类型检测

* `typeof value`

  ```js
  弊端：
   + 不能检测null, typeof null => 'object'
   + 不能细分函数[构造函数，箭头函数，构造器函数]
   + 用typeof检测一个未被声明的变量不会报错，返回 'undefined'
  ```
```
  
* constructor

* instanceof

* Object.property.tostring.call(value)

### 数据类型转换规则

* `把其它类型 [原始值] 转换为对象：Object(value)`

* `把其它类型 转换为 number`

  ```js
  let n = '10';
  console.log(+n); // 10 发生了隐士转换
  或者 ++n / n++
  
  let n = 'a';
  +n => NaN
```

* `把其它类型 转换为 string`

  规则：原始值转换直接用引号包起来【除对象转换为字符串】

  * `(Symbol()).toString()`
  * 

* `把其它类型 转换为 boolean`

  规则：只有`0,null,undefined,NaN,空字符串` 会变成 false,其余都是转换为true

  * `Boolean(value)`
  * `!!value`
  * `!value` 转换为布尔类型取反
  * if 条件判断，会发生隐士转换

* 























#### runtime-dom

> 是为了解决浏览器平台差异（浏览器的）

1. 生成配置文件 -》配置配置文件
2. 

#### runtime-core

> runtime-core 与平台无关，不需要打包成cjs,或者global

#### patchProps

```js
export const patchProps = (el,key,prevValue,nextValue) => {
    switch(key) {
        case 'class':
            patchClass(el,prevValue,nextValue);
            break;
        case 'style':
            patchStyle(el,prevValue,nextValue);
            break;
        default:
            // 如果不是事件，才是属性
            if(/^on[A-Z]/.test(key)) {
               patchEvent(el,key,nextValue);
            } else {
                patchAttr(el,prevValue,nextValue)；
            }
            break;
    }
}
```

* `patchStyle`

  > 注意：不能直接等于新的style, 因为style是一个对象`style:{key1:value1,key2:value2}`

  * el,prev,next => 当前元素，元素旧样式，用户传入的元素的新样式 `const style = el.style;`

  * `next == null` 用户删除样式

  * `next != null ` 

    * prev 中存在的数据，在next中没有

      ```js
      if(prev) {
          for(key in prev) {
              if(next[key] == null) { // 老的里面有，新的里面没有
      			style[key] = '';            
              }
          }
      }
      // next 中的数据，赋值到style上
      for(key in next) {
          style[key] = next[key];
      }
      ```

* `patchAttr`

  ```js
  export const patchAttr = (el,key,value) => {
      if(value == null) {
       	el.removeAttribute(key)   
      } else {
          el.setAttribute(key,value);
      }
  }
  ```

* `patchEvent`

  ```js
  一个元素绑定事件
  注意：给同一个元素绑定新事件，去掉旧事件
  function a(value) {
      const b = (e) => {
          //执行函数
          b.fn(e);
      }
      b.fn = value;
      return b;
  }
  
  btn.addEventListener = a(value)
  ```

  ```js
  // value 值存在，并且对象里面已经存在该事件对应的函数
  // value值存在，对象中不存在对应的事件
        + value值存在 （要绑定事件，以前没有绑过）
        + value值不存在 （以前绑定过事件，但是value不存在）
        
        
  // el: 要绑定事件的元素， key：给元素绑定事件的名称，value：给元素绑定的事件      
  export const patchEvent = (el,key,value) => {
     // 给元素绑定一个缓存事件的列表
     const invoker = (el._vei || (el._vei = {}));
     const exist = invoker[key];
     const eventName = key.slice(2).toLowerCase(); // onClick => click 
      if(value && exist) { // value 值存在，并且对象里面已经存在该事件对应的函数
         exist[key] = value;
      } else {
          if(value) { // value值存在 （要绑定事件，以前没有绑过）
             let invoker = exist[key] = createInvoker(value); // (value) => {value()} 
             el.addEventListener(eventName,invoker) 
          } else { value值不存在 （以前绑定过事件，但是value不存在）
              el.removeEventListener(eventName,exist);
              invoker[key] = undefined;    
          }
      }
  }
      
  function createInvoker(fn) {
      const invoker = (e) => {
          invoker.fn(e)
      }
      invoker.fn = fn; // 为了能随时更改用户传递过来的函数
      return invoker;
  }      
  ```

* `index.ts`

  ```js
  // 渲染时用到的所有方法
  // extend => Object.assign() 函数的封装
  const rendererOptions = extend({ patchProp }, nodeOps)
  export function createApp (rootComponment,rootProps = null) {
      const app =  createRenderer(renderOptions).createApp(rootComponment,rootProps)；
      let {mount} = app;
      app.mount = function(container) {
          container = nodeOps.querySelector(container);
          container.innerHTML = '';
          mount(container); // 函数劫持
      }
      return app;
  }
  
  function createRenderer(renderOptions) { // 告诉core怎么渲染
      return {
          createApp(rootComponment,rootProps) {
             const app = {
                  mount(container) { // 挂载的目的地
                      
                  }
              }
             return app;
          }
      }
  }
  
```

#### 虚拟dom的创建

* 元素渲染需要虚拟dom和容器
  * 创建虚拟dom

#### 将元素渲染到页面

* 将虚拟节点和容器获取到后调用render方法进行渲染

```js
0b 表示二进制
     00000001 == 1*2^0
		 00000011 == 1*2^1 + 1*2^0	
1<<1 00000010 == 1*2^1 + 0*2^0 =》2
1<<2 00000100 == 1*2^2 + 0*2^0
```

