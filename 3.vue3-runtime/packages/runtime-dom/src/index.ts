// 核心就是 提供domApi方法

import { createRenderer } from "@vue/runtime-core/src";
import { extend } from "@vue/shared/src" // Object.assign
import { nodeOps } from "./nodeOps"
import { patchProp } from "./patchProp"

/**
 * 渲染时用到的方法 
 *   处理节点操作：增删改查
 *   属性操作：添加，删除，更新样式，类，属性，事件，文本操作
 */
const renderOptions =  extend({patchProp},nodeOps);
/**
 * @param rootComponent 根组件
 * @param rootProps 根属性
 * <div id="#app"></div>
 * let app = { render() {} }
 * createApp(app,{name:'zs',age:20}).mount('#app')
 */
export function createApp (rootComponent,rootProps = null){
    let app = createRenderer(renderOptions).createApp(rootComponent,rootProps);
    let {mount} = app;
    // debugger
    app.mount = function(container) { // 函数重写 (当调用mount函数的时候，会传递一个container参数) 
        container = nodeOps.querySelector(container);
        // 在渲染到页面之前，需要将容器内的内容清空
        container.innerHTML = '';
        mount(container); // 函数劫持
    }
    return app;
}