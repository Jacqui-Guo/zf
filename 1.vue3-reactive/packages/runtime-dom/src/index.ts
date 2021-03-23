import { createRender } from '@vue/runtime-core/src';
import { extend } from '@vue/shared/src';
import {nodeOps} from './nodeOps';
import {patchProp} from './patchProps';


const renderOptions = extend({patchProp},nodeOps); // object.assign


// ++++++++++++++ 2、将组件渲染成dom元素，进行挂载+++++++++++++++
// function createRender(renderOption) {
//     return {
//         createApp(rootComponent,rootProps) {
//             const app = {
//                 mount(container){ // 挂载的目的地
//                     console.log('render',container,rootComponent,rootProps);
//                 }
//             }
//             return app;
//         }
//     }
// }



export function createApp(rootComponent,rootProps = null){
    //          告诉createRender使用renderOptions这些api进行dom渲染
    const app = createRender(renderOptions).createApp(rootComponent,rootProps)
    const {mount} = app;
    app.mount = function(container) {
        // 1、容器挂载之前需要先清空容器
        container = nodeOps.querySelector(container);
        container.innerHTML = '';
        
        // 2、将组件渲染成dom元素，进行挂载
        mount(container);
    }
    return app;
}