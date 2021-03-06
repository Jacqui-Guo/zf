import { createVNode } from "./vnode";

export function createAppAPI(render) {
    return function  createApp(rootComponent,rootProps) { // 创建应用：需要提供是哪个组件，哪个属性
        const app = {
            _props: rootProps,
            _component: rootComponent,
            _container: null,
            mount(container){ // 挂载的目的地
                // let vnode = {};
                
                // 1、根据组件创建虚拟节点
                // 2、将虚拟节点和容器获取到后调用render方法进行渲染


                // 根据组件创建虚拟节点
                const vnode = createVNode(rootComponent,rootProps);

                render(vnode,container);



                // 创建render



                app._container = container;

            }
        }
        return app;
    }
}