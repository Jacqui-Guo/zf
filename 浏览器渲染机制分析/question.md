1. **浏览器渲染html的过程?**
   
    + `遇到外链js是否阻塞渲染`
      
      - 情况一：会阻塞GUI渲染(一个单独的js文件，函数，对元素对操作.... )
      - 情况二：如果给window添加 DOMContentLoaded(DOM渲染完成),或 onload(页面所有资源加载完成) 事件监听，不会阻塞GUI渲染
      - 情况三：使用 async 请求JS资源是异步的【单独开辟HTTP去请求】，此时GUI继续渲染，但是一旦当js请求回来，会立即暂停GUI的处理，接下来会渲染JS
      - 情况四：使用 defer 不会阻碍GUI渲染，当GUI渲染完，才会把全部使用defer的请求回来的JS去渲染    
      
    + `遇到外链css是否阻塞渲染`
      
      - 不会阻塞GUI渲染
      - GUI渲染线程会开辟一个http线程请求外链的css，此时GUI会继续向下渲染，css资源请求回来之后，GUI再去渲染请求回来的css资源
      
    + `script标签有多少个属性值、分别作用`
    
      ```js
      <script type="text/javascript" src="index.js" async/defer></script>
      
      - type="text/javascript" 告诉浏览器我引入的代码是 文本 形式的 js
      - src 外链js的路径
      - async: 对js进行异步加载
      - defer: 延迟js文件渲染，当GUI渲染完成，再去渲染
      ```
    
      
    
2. **为什么css要放在头部，js要放在内部?**
   `css放在头部：`
   
      - 为了在没有dom渲染的时候，通知http网络线程请求css资源，此时并不会阻塞GUI的渲染，并且重新利用时间差，加快渲染速度
   
   `js 放在底部：`
   
      - 防止阻塞GUI渲染
   
3. **ajax、promise、async await 三者的关系?**
   
> promise: 主要用于解决回掉地狱问题，一般用于封装 函数，后台请求

   ```js
   function _ajax() {
     return new Promise((resolve,reject) => {
       $.ajax({
         ....
         success:(res) => {
           resolve('success')
         },
         fail: (err) => {
           reject('error')	
         }  
       })
     })
   }
   
   async function _getData() {
     let _res = await _ajax().then(res => {
        console.log(res); // success
     }).catch(err => {
        console.log(err); // error
  })
   
     console.log('上面执行完，才会输出我');
}
   
   _getData();
   ```

   ```js
   async 属性的值为 false 时是同步的，ajax请求将整个浏览器锁死，只有当ajax请求成功之后，才会执行下面的console语句
   
   $.ajax({
     async: false,
     .....
   })
   console.log('上面执行完，才会输出我');
   ```


4. **使用原生js封装一个ajax?**

```js
/**
 * 1、创建一个ajax对象
 * 2、建立网络链接 open
 * 3、发送请求 send
 */

function Ajax(type,data,success,failed) {
    let xhr = new XMLHttpRequest();
    let _type = type.toUpperCase()
    let _str;

    for(let key in data) {
        _str += `${key}=${data[key]}&`; 
    }

    let _url = `https://www.xxxx.com`;
    // (请求类型，url,是否异步)
    if(_type === 'GET') {
        _url = `${_url}?${str}`;

        xmr.open('GET',_url,true);
        xmr.send();
    } else if(_type === 'POST') {
        xmr.open('POST',_url,true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    /**
     * 每当 readyState 值发生变化，都会触发 onreadystatechange 重新执行
     * 0 ：请求未初始化
     * 1 ：服务器连接已建立
     * 2 ：请求已接受
     * 3 : 请求处理中
     * 4 ：请求已完成，且相应就绪 
     */
    
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){ // 请求完成
            if(xhr.status == 200){
                success(xhr.responseText);
            } else {
                if(failed){
                    failed(xhr.status);
                }
            }
        }
    }
     
}
```






## CRP(critical rendering path) 关键渲染路径
> 围绕渲染的机制和步骤，去详细的进行每一步的优化，以此来提高页面的渲染速度和运行性能
1. 从服务器基于http网络，请求回来的数据
   - 数据是：16进制的文件流
   - 浏览器把它解析为字符串(html字符串) 
   - 按照w3c规则，识别称为一个个节点【语法解析】
   - 拿到节点，按照层级结构，生成xxx树（html 是dom树）
2. 访问页面，首先请求回来的是一个html文档，浏览器开始自上而下渲染
   - 进程：一般指一个程序（浏览器打开一个页面，就相当于开了一个进程）
   - 线程：指进程中具体去执行事务的东西，一个线程同时只能干一件事
   - 注意：一个进程中，可能会包含一到多个线程
   - 同步编程：一般是只有一个线程去处理事情，上面的事情处理不完，下面的事情无法处理【一件事一件事去干】
   - 异步编程：
    - 多线程异步编程
    - 单线程异步编程：(JS是 EventQueue + EventLoop 完成单线程异步编程的)

   (浏览器是可以开辟多个进程/线程的) 
    - GUI 渲染线程：主要是用来渲染页面的
    - JS引擎线程：渲染JS代码的
    - http网络线程，可以开辟多个，从服务器获取资源和数据的
    - 定时器监听线程
    - dom监听线程
3. 
从 http 网络层拿到 16 进制的数据 -》进行网络解码，解析成html标签

## 渲染页面过程
1. 遇到style内嵌样式，GUI直接渲染即可
2. 遇到link先去请求css
   - 遇到link之后，GUI渲染线程 -》开辟一个http(网络)线程，去请求资源信息，同时GUI继续向下渲染[异步]
    - 浏览器同时能够发送http请求是有数量限制的(谷歌 5-7个)
    - 超过最大并发限制的http请求，需要排队等待
    - http请求一定是越少越好。。。。
3. 遇到@import, 
   
   - 浏览器也是开辟HTTP线程去请求资源，但是此时GUI也暂定了(导入式样式会阻碍GUI的渲染) ，当资源请求回来之后，GUI才能继续渲染 --- [同步] 
4. 遇到 script(内嵌/外链)
   - 外链 <script src=""></script> [同步]
    - 会阻碍GUI的渲染，会一直在那等着，一直到资源加载完成,GUI才继续向下渲染
    - 或者给js添加 window.addEventListener('load',function(){}), // 等待页面所有资源加载完成，才会触发执行
   - 内嵌(遇到之后直接解析)
   - defer: 和link是类似的机制了，不会阻碍GUI渲染，当GUI渲染完，才会把请求回来的JS去渲染
   - async：请求JS资源是异步的【单独开辟HTTP去请求】，此时GUI继续渲染，但是一旦当js请求回来，会立即暂停GUI的处理，接下来会渲染JS

   ```js
      假如我们有五个请求，如果不设置任何属性，肯定是按照顺序请求和渲染JS的【依赖关系是有效的】
      但是如果设置async，谁先请求回来就先渲染谁，依赖关系是无效的；
      如果使用defer是可以建立依赖关系的(浏览器内部在GUI渲染完成后，等待所有defer的资源都请求回来，再按照编写的依赖顺序去加载渲染js)
   ```

   ```js
      真实项目开发，我们一般把link放在页面的头部【是为了在没有渲染DOM的时候，就通知HTTP去请求css了，这样DOM渲染完，css也差不多回来了，更有效的利用事件，提高页面的渲染速度】
      我们一般把js放在页面的底部，防止其阻碍GUI的渲染，如果不放在底部，我们最好设置上 async/defer...
   ```

5. DOM TREE(DOMContentLoaded事件触发) -》【执行JS】？ -》CSSOM TREE -》RENDER TREE 渲染树 

   - 页面第一次渲染，必然会引发一次回流和重绘
   - 如果我们该改变了元素的位置和大小，浏览器需要重新计算元素在视口中的位置和大小信息，重新计算的过程是回流/重排，一旦发生了回流操作，一定也会触发重绘【很消耗性能：DOM操作消耗性能，90%说的都是它】
浏览器会做容错处理
   - 如果只是普通样式的改变，元素的大小位置没有改变，不出触发重绘，但是会触发回流

6. 重绘，回流
   * 重绘：元素样式改变(大小位置不变)
   * 回流：元素的大小或者位置发生了变化，触发了重新布局，导致渲染树重新计算布局和渲染
   * 回流一定会触发重绘，但是重绘不一定触发回流
7. 前端性能优化之：避免DOM回流
   * 减少回流，把获取样式和设置样式的操作分离开(读写分离)
   * 样式集中改变
   * 批量修改样式
   * transform,opacity 不会触发重绘

* css 选择器渲染是从右到左
* 标签语义化，和避免深层次嵌套(dom树生成就慢)
* 尽早尽快的把css下载到客户端，(充分利用http多请求并发机制)

## Promise
```js
为什么要使用promise？
  - 1、用来管控异步编程的
  - 2、是es6新增的一个内置类，用的时候是 new Promise()
  - promise本身是一种承诺模式
  注意：promise 为解决回掉地狱而出来的一种异步编程方式 这个步骤是错的
      先出来的异步编程方式，出来之后，才发现 解决回掉地狱

```


