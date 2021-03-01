11:00

// 属性操作：添加，删除，更新，样式操作，类，时间，其他属性

1、runtime-dom -> src -> nodeOps.ts
   + createElement: tagName => document.createElement(tagName)
   + remove: child => {
       const parent = child.parentNode;
      }
   + insert: (child,parent,anchor=null) => {
       parent.insertBefore(child,anchor);
      }
   + querySelector: selector => document.querySelector(selector)
   + setElementText: (el,text) => el.textContent = text
      // 文本操作: 创建文本，
   + createText: text => document.createTextNode(text)
   + createText: text 
   + setText:(node,text)

   // 属性操作
   src->patchProp.ts
   export const patchProp = (el.key,preValue,nextValue)=> {
       
   }

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

  

* 