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

1. 生成配置文件 -》配置配置文件
2. 

#### runtime-core

> runtime-core 与平台无关，不需要打包成cjs,或者global