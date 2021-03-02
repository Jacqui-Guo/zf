// createRenderer 目的是创建一个渲染器

import { ShapeFlags } from "@vue/shared/src";
import { createAppApi } from "./apiCreateApp"
import { createComponentInstance, setupCompent } from "./components";

// 框架都是将组件转化成虚拟DOM -》虚拟DOM生成真实dom 挂载到真实页面上 
export function createRenderer(renderOption) {
    // 让render执行，并且创建一个effect
    const setupRenderEffect = () => {

    }
    
    
    // +++++++++ 4 ++++++++++++++++
    // 挂载组件 (mountComponent最核心的就是调用setup/render，拿到函数返回结果来进行渲染)
    const mountComponent = (initialVnode,container) => {
        // 1.先有实例
        // createComponentInstance 创造一个实例
        /**
         * 这种写法类似于
         * let a = 1,b=2,c=3;
         * a = b = c // a=3
         * 计算顺序：从右向左
         */
        // initialVnode.component = createComponentInstance(initialVnode)
        // const instance = initialVnode.component
        const instance =  (initialVnode.component = createComponentInstance(initialVnode))
        console.log('xxxx',instance);
        // 2.需要的数据解析到实例上
        setupCompent(instance)
        // 3.创建一个effect 让render函数执行
        setupRenderEffect()
    }

    // +++++++++ 3 ++++++++++++++++
    // 处理组件
    const processMount = (oldVnode,newVnode,container) => {
        if(oldVnode == null) { // 挂载组件
            mountComponent(newVnode,container);
        } else { // 组件更新

        }
    }
     // +++++++++ 2 ++++++++++++++++
    // 虚拟节点比对
    const patch = (oldVnode,newVnode,container) => {
        let {shapeFlag} = newVnode;
        if(shapeFlag & ShapeFlags.ELEMENT) { // 用 & 不用&& 的原因：&比&&计算快，效率更高
            console.log('元素');
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
            console.log('组件',shapeFlag,ShapeFlags.STATEFUL_COMPONENT);
            // 处理组件
            processMount(oldVnode,newVnode,container);
        }
    }
    
     // +++++++++ 1 ++++++++++++++++
    const render = (vnode,container) => { // 渲染的时候需要虚拟dom和容器

        // 根据不同的虚拟节点，创建对应的真实元素
        /**
         * 不管是初始化，还是重新渲染都会重新调用patch方法，
         * 默认会执行render,render执行的时候是初始化，第一次渲染的时候没有之前的虚拟节点数据
         */

        /**
         * 参数一：之前的vnode
         * 参数二：当前要渲染的vnode
         * 参数三：要渲染到哪个容器中
         */ 
       
        patch(null,vnode,container);
    }
    return {
        createApp: createAppApi(render)
    }
}