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
>
> 向 Set 加入值的时候，不会发生类型转换，所以`5`和`"5"`是两个不同的值
>
> Set 内部判断两个值是否不同,使用的是 ===

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

set 类似于数组，一般用于数组去重

Map  本质上是建值对的集合，类似于集合，具有极快的查找速度



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

1. vue3源码采用 `monrepo` ，目前只有 `yarn ` 才支持

2. vue2后期引入`rfc` 使每个版本可控

3. `Vue3` 劫持数据采用proxy `Vue2` 劫持数据采用`defineProperty`。 `defineProperty`有性能问题和缺陷

   > defineProperty 会把一个对象进行完整的递归，完了给每个属性添加get和set
   >
   > Vue3 采用proxy, 它不需要改写属性的get, set 也不用一上来就递归，而是当使用到某一层的时候才进行处理
   
4. vue3 diff算法(可以根据patchFlag做diff),并且采用了最长递增子序列算法，vue2采用的是全量diff

5. Fragment 可以支持多个根节点，

6. vue2采用的是 `options api` vue3采用的是 `compositionApi` 

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

* esm：说明是一个es6模块 `export default`
* cjs：cjs node模式 `module.exports`
* global：全局浏览器环境下引用的
* Life: 立即

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
 1、创建四个函数 reactive(整个数据都是响应式的)，shallowReactive(只有数据的第一层是响应式的)，readonly(数据是只读的)，shallowReadonly(只有第一层数据是只读的)
 2、创建一个响应式函数，根据传递的参数不同(target,isReadonly,响应式函数)，实现不同的功能
   + 判断拦截的对象是不是object,如果不是，直接返回
   + 根据是不是只读的，将target存入到不同的存储栈中
   + 存储之前，判断存储栈中是否已经存在过(即是判断当前target是否已经被代理过)，存在直接返回target    
 3、创建proxy的拦截函数 createGetter,createSetter（封装了一个函数，处理上面对应的四种情况）
   + createGetter  
   		+ let res = Reflect.get(target,key,receiver);
      + 判断是否是 isReadonly,如果不是只读的，进行依赖收集(当使用了effect()的时候才会执行effect对应的函数，否则effect栈中是空的，会直接返回)
      + 判断是否是shallow,如果是，直接返回 res
      + 判断res是否是object,对其进行递归处理
   + createSetter
      + 先获取到 oldValue
      + 判断target上有没有key,还要考虑当前target为数组/object两种情况
         + array情况：判断当前修改的数组的索引是否大于数组的长度
      + 调用trigger方法，触发更新 
```
#### 手写effect函数

###### effect函数的使用

```js
/*
 * 1、effect中所有属性，都会收集effect  （track函数）
 * 2、当这个属性值发生变化的时候，会重新执行effect （trigger函数）
 */
let state = reactive({name:'zs',arr:[1,2,3]})
effect(()=>{
  app.innerHTML = state.arr;
  state.name // 会执行 effect,track 函数 依赖收集
}) 
setTimeOut(() => {
  state.arr[100] = 1;// 会执行trigger触发更新
},1000)

trigger 函数 找属性对应的effect 让其执行 （数组、对象）
```

###### 手写effect函数

```js
export function effect(fn,options={}){
  // 1、需要将这个数据变成响应式的，createReactiveEffect,可以做到数据变化重新执行
  const effect = createReactiveEffect();
  
  // effect函数调用的时候，默认会先执行一次
  if(!options.lazy){
    effect()
  } 
  return effect;
}

let activeEffect;
let effectStack = [];

const createReactiveEffect = (fn,options) => {
  const effect = function reactiveEffect() {
    try {
      if(!effectStack.includes(effect)) {
         effectStack.push(effect);
         activeEffect = effect;
         return fn(); // 这样就会执行reactive中的get，或set方法
      }
    }finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length-1]
    }
  }
  return effect;
}
```
#### 手写依赖收集 track

> 所谓的依赖收集，就是收集当前target对应的effect函数

```js
const targetMap = new WeakMap();
export function track(target,type,key){ 
  if(activEffect === undefined) return;
  
  let depsMap = targetMap.get(target);
  if(!depsMap){
    depsMap.set(target,(depsMap=new map))
  }
  let depMap = depsMap.get(key);
  if(!depMap){
     depMap.set(key,(depMap=new Set))
  }
  if(!depMap.has(activeEffect)){
  	  depMap.add(activeEffect); 
  }
}

/**
 * track函数的数据解构
 *  {name:'zs',age:20} 对应的effect: [effect1,,,,]  weakmap 进行存储
 *    - name 对应的effect: [effect1,effect2,,,,] 可能有多个effect
 *    - 或者是
 * 
 * weakmap
 *   - key(obj)
 *   - val(map)
 *     - key
 *     - val(set)
 *       - key
 *       - val
 */
```
#### 手写trigger函数

> 找属性对应的effect 让其执行 （数组、对象）

#### 分析总结

1. ##### reactivity中包含的数据是怎么变成响应式的？

   ```js
   所谓的响应式就是reactivity中的数据发生变化,会触发页面中依赖reactivity数据的页面更新
   let state = reactivity({name:'zs',age:20});
   
   ```

2. ##### 当调用effect函数的时候发生了什么？

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

#### 组件创建流程

#### 组件`render`函数调用关系

```js
每一个组件都有一个effect,vue3是组件级更新，数据变化会重新执行对应的effect
```

#### `computed`

**使用：**

```js
const age = ref(18);
- computed 使用方式1
const myAge = computed(() => {
  return age.value + 10
})
- computed 使用方式2
const myAge = computed({
  get(){},
  set(){}
})

⚠️ 注意：
- computed 方法不会默认执行
- 只有当访问 myAge.value (computed中值的时候) computed 才会执行
- 但是当 myAge.value，myAge.value 多次访问，只要 myAge.value 中的数据没发生变化，就会调用缓存中的数据 
- age.value = 100; // 更新age，myAge不会立刻重新计算
- 只有当 myAge.value 取值的时候，才会再次重新计算最新值 
```

**函数封装：**

```js
class ComputedRefImpl {
  public _dirty = true;
  public effect;
  public _value;
  constructor(getter,public setter) {
    this.effect = effect(getter,{
      lazy: true
    })
  }
  get value() {
    if(this._dirty) {
       this.effect = effect();
    }
    return this._value;
  }

  set value(newVal) {
    this.setter(newVal);
  }
}

export function computed(getterOrOptions) {
  let getter;
  let setter;
  if(isFunction(getterOrOptions)) {
     getter = getterOrOptions;
     setter = () => {
       console.warn('computed value must be readonly')
     }
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl(getter,setter);
  // 因为访问computed中值是通过: computed.value 的形式，内部需要重新构建一个对象
}
```

**实现思路：**

```js
1、computed 使用有两种方式，判断调用computed传递的参数是function,还是object
2、访问computed中值是通过: computed.value 的形式，因此computed内部需要重新构建一个对象
3、对computed中收集的属性，重新赋值，直接使用传递的setter函数
4、getter获取数据：内部维护了一个effect，进行依赖收集与触发更新
5、还需要考虑当在effect函数中，调用computed中值当情况
   - 取值的过程中，让父级函数也可以收集到自己this： track(this,TrackOpTypes.GET,'value'); 
6、当缓存的数据发生变化时
   - 当父级函数中子属性更新了，除了更新子属性自己，还要通知父级函数收集的依赖进行更新 
    trigger(this,TriggerOrTypes.SET,'value')
```

### createApp





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


2. vue2 和 vue3 computed的原理是不一样的

   ```js
   /**
    * vue2 中计算属性是不具有收集依赖的功能的
    * vue3 中计算属性也要收集依赖
    * 计算属性本身就是一个effect
    */
   ```
   
3. vue2中不使用 `tree shacking` 的原因

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

4. Vue3 `tree shacking`

   ```js
   let a = 1;
   let b = 2;
   console.log(a);
   
   tree shacking 在代码打包的时候，会把一些没有用到的数据删掉(shacking)
   即用不到的代码 不进行打包
   ```

5. vue3中 `template` 和 `jsx`

   ```js
   template 会做模版的静态分析	
   template 在编译的过程中，会告诉人家，哪些模版是静态的，哪些是动态的
   
   jsx 语法更加灵活，在编译的过程中，少了一些分析的功能
   ```

6. vue2中的update和vue3中的effect的区别

   ```js
   update：是任何数据的变化都会重新执行
   effect：只有state中依赖的属性和effect有关联，就会重新执行
   let state = reactive({name:'zs',age:20,info:'xxx'})
   effect(()=>{
     app.innerHTML = `内容 ${state.name} ${state.age}`
   })
   ```

7. vue3中的effect相当于vue2中的watcher

8. `Vue3 模版编译流程`

   * 先将模版进行分析，生成对应的ast树
     - `ast树就是使用对象来描述js语法的`
   * 做转换流程，`使用 transform 对动态节点做一些标记，如指令，插槽，事件，属性...`
     * `标记：使用patchFlag进行标记`
   * 代码生成 
     * 使用 `codegen生成最终代码`

9. `Vue3中Block, BlockTree`

   > vue3重要变化：新增了blockTree,目的是收集动态节点
   >
   > block 是一个能够收集动态节点的节点

   ```js
   在vue2中，diff算法的特点是递归遍历
   - 每次比较同一层，之前写的都是全量比对
   - block的作用就是为了收集动态节点(它自己节点下面所有的)，将树的递归，拍平成了一个数组
   - 在createVNode的时候，会判断这个节点是动态的，就让外层的block收集起来
   - 目的是diff的时候，只diff动态的节点
   ```

   * `什么样的节点会被标记成block`

     > 会影响解构的，v-if, v-else
     >
     > 父亲也会收集儿子的block, blockTree是有多个节点组成

   ```js
   改变结构的也要封装到block中，我们期望的更新方式，是拿以前的和现在的区别  **靶向更新**
   如果前后节点个数不一致，那只能全部对比
   
   block --> div
     block -> v-for 不收集动态节点了
     
   block -> div
   	block -> v-for 不收集动态节点了
     
   两个儿子的全量比对  
   ```

10. `patchFlags 对不同的节点进行描述`

   > 表示要比对哪些类型

11. vue2与vue3的区别？

    ```js
    * 性能优化
      - 每次重新渲染 都要使用createVNode这个方法，创建虚拟节点
      - 静态提升  对静态节点进行提取
      
    * 事件缓存
      - 
    ```

12. `Props`与`attrs` 的区别

    ```js
    /**
     * props与attrs有什么区别？
     *   - <my-component a=1 b=2></my-component>
     *     + a,b 是attr,属性
     *     + 接收组件传递过来的数据 { // 这个是props
     *                              props:['a']
     *                           }
     */
    ```

    

13. 

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
>
> 核心就是提供domApi方法的

1. 生成配置文件 -》配置配置文件
2. `处理dom节点操作(增删改查)，属性操作(增删改查)，样式，类，事件，其他属性`
3. `createApp` 创建应用
   1. 容器挂载之前需要先清空容器
   2. 将组件渲染成dom元素，进行挂载 `createRender`
      * **createRender 目的是创建一个渲染器**，`将哪个人，渲染到哪个容器上`

##### 创建虚拟节点

```js
1、创建虚拟节点，就是使用一个 {} 用来模拟节点
2、{} 中需要包含当前自己节点是什么类型 shapeFlag
3、{} 需要包含 key ，因为diff算法会用到
```

```js
// 根据组件创建虚拟节点

import { isArray, isObject, isString } from "@vue/shared/src";
import { ShapeFlags } from "packages/shared/src/shapeFlag";

// h('div',{style:{color:red}},'children') h方法与createApp方法类似
export const createVNode = (type,props,children = null) => {
    // createVNode 接受的第一个参数有两种：1，component 2,传入的值可能是普通元素
    // 给虚拟节点加一个类型
    const shapeFlag = isString(type) ? 
        ShapeFlags.ELEMENT : isObject(type) ? 
        ShapeFlags.STATEFUL_COMPONENT : 0;

    // 根据type来区分是组件(对象)，还是普通元素(字符串)
    const vnode = { // 创建一个对象来描述对应的内容，虚拟节点有跨平台的能力
        __v_isVnode: true,
        type,
        props,
        children,
        el:null, // 稍后会将虚拟节点和真实节点对应起来
        key: props && props.key, // diff算法会用到key
        shapeFlag 
    }
    // 判断出当前自己的类型和儿子的类型
    normalizeChildren(vnode,children);
    return vnode;
}

function normalizeChildren(vnode,children) {
    let type = 0;
    if(children === null) {

    } else if(isArray(children)) {
        type = ShapeFlags.ARRAY_CHILDREN
    } else {
        type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.shapeFlag = vnode.shapeFlag | type; // 自己与儿子的类型取 ｜ 运算
    /**
     * 为什么要拿自己和自己儿子的类型取 ｜ 运算？
     *   因为得出的结果包含 自己是什么类型，自己的儿子是什么类型
    */ 
}
```

##### 创建render

> 将虚拟节点和容器获取到后调用render方法进行渲染

#### runtime-core

> runtime-core 与平台无关，不需要打包成cjs,或者global
>
> `使用 runtime-dom 中的 api 进行渲染	`

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
    
    let i ={name:fn}; exist = i[name] => fn
    
     const invoker = (el._vei || (el._vei = {}));
     const exist = invoker[key];
     const eventName = key.slice(2).toLowerCase(); // onClick => click 
      if(value && exist) { // value 值存在，并且对象里面已经存在该事件对应的函数
         exist.value = value;
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
```

#### 虚拟dom的创建

* 元素渲染需要虚拟dom和容器
  * 创建虚拟dom

#### 将元素渲染到页面

* 将虚拟节点和容器获取到后调用render方法进行渲染

​```js
0b 表示二进制
     00000001 == 1*2^0
		 00000011 == 1*2^1 + 1*2^0	
1<<1 00000010 == 1*2^1 + 0*2^0 =》2
1<<2 00000100 == 1*2^2 + 0*2^0
```

## TS

###  安装ts

- npm install typescript -g
- tsc --init 生成配置文件
- 希望可以直接运行ts （测试）
- code runner + npm install ts-node -g

> 全局编译(将ts编译成js) , code runner 用node环境来执行ts

### 构建工具来处理ts

- webpack × 、 rollup √
- 解析ts的方式 有两种：1, ts插件来解析 ，2,通过babel来解析
- rollup 一般情况下会采用 rollup-plugin-typescript2
- webpack ts-loader / babel-plugin-typescript

### 解析ts的两种方式

#### 1.全局编译TS文件(使用插件)

全局安装`typescript`对`TS`进行编译`(使用node环境来执行ts)`

```bash
npm install typescript -g
tsc --init # 生成tsconfig.json
```

```bash
tsc # 可以将ts文件编译成js文件
tsc --watch # 监控ts文件变化生成js文件
```

#### 2.使用`rollup`解析ts

> 使用rollup解析文件： 一般情况下会采用 rollup-plugin-typescript2 + ts.config.js  就可以解析ts文件

> 使用webpack解析文件：一般采用 ts-loader / babel-plugin-typescript

- 安装依赖

  - `rollup` 安装构建工具
  - `rollup-plugin-typescript2`  让rollup可以识别typescript,类似于：rollup与ts之间的桥梁
  - `@rollup/plugin-node-resolve` 在rollup中默认是不支持引入第三方插件的，所以需要安装当前插件
  - `rollup-plugin-serve` 起一个服务，看rollup运行的结果

  ```bash
  npm install rollup typescript rollup-plugin-typescript2 @rollup/plugin-node-resolve rollup-plugin-serve -D
  ```

- 初始化`TS`配置文件

  ```bash
  npx tsc --init
  ```

- `webpack`配置操作

  ```js
  // rollup.config.js
  import ts from 'rollup-plugin-typescript2'; // rollup和ts的桥梁
  import {nodeResolve} from '@rollup/plugin-node-resolve'; // 解析node第三方模块
  import serve from 'rollup-plugin-serve';
  import path from 'path'
  export default {
      input:'src/index.ts',
      output:{
          format:'iife', // 立即执行函数,自执行函数
          file:path.resolve(__dirname,'dist/bundle.js'), 
          sourcemap:true // 源码映射文件，方便代码调试
      },
      plugins:[
          nodeResolve({ // 先解析第三方插件,解析的后缀名
              extensions:['.js','.ts'] // 默认解析js，如果js找不到就解析ts
          }),
          ts({
              tsconfig:path.resolve(__dirname,'tsconfig.json')
          }),
          serve({
              open:true,
              openPage:'/public/index.html', // 启动端口之后默认打开的配置文件
              port:3000,
              contentBase:'' // 起的服务是以根目录为基准
          })
      ]
  }
  ```

- `package.json`配置

  ```json
  "scripts": {
        "dev": "rollup -c -w"
  }
  ```

> 我们可以通过`npm run dev`启动服务来使用typescript啦~

### ts中 `null,undefined` 介绍

```js
- null,undefined 是任何类型的子类型，
但是当tsconfig.json中配置了 strict:true,
也就是说，在严格模式下，null,undefined是其它类型的子类型是会报错的

- 严格模式下不能把 null 赋值给 void
```

### TS中的数据类型

#### 枚举

```js
const enum ROLE{
  ADMIN,
  MAMAGE,
  USER
}

如果不加 const 打包之后生成js,会是对象的形式，
一般情况下不需要用 反举 都添加 const

- 枚举可以支持反举，但是限于索引，会根据上一个人的值，进行自动推断

const enum ROLE{
  ADMIN,
  MAMAGE=5,
  USER
}
ROLE.USER = 6 // 会根据上一个的值，进行自动推断
```





```js
1、可以用接口来描述实例
泛型的用处在于，当我们调用的时候，确定类型，而不是一开始就写好的，类型不确定，只有在执行的时候才确定


const createArray

```





















