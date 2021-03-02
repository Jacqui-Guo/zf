import { createVNode } from "./vnnode";

export function createAppApi(render) {
    // 告诉他哪个组件，哪个属性来创建应用
    return function createApp(rootComponent,rootProps) {
        const app = {
            _props: rootProps,
            _component: rootComponent,
            _container: null,
            mount(container) {
                // let vnode = {};
                // render(vnode,container)  
                
                // 1.根据组件创建虚拟节点
                // 2.将虚拟节点和容器获取到后调用render方法进行渲染

                /**
                 * 创建虚拟节点
                 */
                let vnode = createVNode(rootComponent,rootProps);
                 /**
                  * 调用render方法进行渲染
                  */ 
                //  let vnode = {};
                render(vnode,container)   
                app._container = container; 
            }
        }
       return app;
    }
}