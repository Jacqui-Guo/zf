import { ShapeFlags } from "packages/shared/src/shapeFlag";
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./components";

export function createRender(renderOption) {
    // 创建一个effect，让render函数执行
    const setupRenderEffect = () => {

    }






    const mountComponent = (initivalVNode,container) => {
        console.log('组件挂载',initivalVNode,container);
        // 组件的渲染流程
        // let App = {
        //     setup(){return {}},
        //     render() {console.log('render');}
        // }
        /**
         * mountComponent: 最核心的就是调用 setup 拿到返回值
         *                 或者 获取render函数返回的结果来进行渲染 
         */


        // 1、先有实例
        const instance = initivalVNode.component = createComponentInstance(initivalVNode);
        // 2、将需要的数据解析到实例上
        setupComponent(instance); // 初始化这个组件
        // 3、创建一个effect，让render函数执行
        setupRenderEffect();
    }

    const processComponent = (oldVNode,newVNode,container) => {
        if(oldVNode === null) { // 组件没有上一次的虚拟节点
            // --------------- 3、组件挂载---------------
            mountComponent(newVNode,container);

        } else { // 组件更新流程

        }
    }
    
    const patch = (oldVNode,newVNode,container) => {
        // 针对不同类型 做初始化操作
        const {shapeFlag} = newVNode;
        if(shapeFlag & ShapeFlags.ELEMENT) {
            console.log('元素');
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
           
           // --------------- 2、处理组件的更新---------------
           processComponent(oldVNode,newVNode,container);
        }
    }
    
    const render = (vnode,container) => {
        // console.log('render',vnode,container);
        // 将 vnode 渲染到 contaienr中

        // core 的核心，根据不同的虚拟节点，创建对应的真实元素 

        // 默认调用render 可能是初始化流程
        // 更新的话，肯定是两个虚拟节点之间的比对，第一次更新，虚拟节点肯定是没有的 null，
        // --------------- 1、虚拟节点更新---------------
        patch(null,vnode,container)
    }
    return {
        // createApp(rootComponent,rootProps) { // 创建应用：需要提供是哪个组件，哪个属性
        //     const app = {
        //         mount(container){ // 挂载的目的地
        //             let vnode = {};
        //             render(vnode,container);
        //         }
        //     }
        //     return app;
        // }
        createApp: createAppAPI(render)
    }
}

// 框架都是将组件 转化成虚拟DOM -》 虚拟DOM生成真实DOM挂载到真实的页面上