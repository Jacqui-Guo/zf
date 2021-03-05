import { effect } from "@vue/reactivity/src";
import { isObject, ShapeFlags } from "@vue/shared/src";
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component";
import { queueJob } from "./scheduler";
import { normalizeVNode ,Text} from "./vnode";

export function createRenderer(rendererOptions) { // 告诉core 怎么渲染

    const {
        insert: hostInsert,
        remove: hostRemove,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateText,
        createComment: hostCreateComment,
        setText: hostSetText,
        setElementText: hostSetElementText,
        nextSibling: hostNextSibling,
    } = rendererOptions


    // -------------------组件----------------------
    const setupRenderEfect = (instance, container) => {
        // 需要创建一个effect 在effect中调用 render方法，这样render方法中拿到的数据会收集这个effect，属性更新时effect会重新执行

        instance.update = effect(function componentEffect() { // 每个组件都有一个effect， vue3 是组件级更新，数据变化会重新执行对应组件的effect
            if (!instance.isMounted) {
                // 初次渲染
                let proxyToUse = instance.proxy;
                // $vnode  _vnode 
                // vnode  subTree
                //                                                    第一个参数是this,第二个参数是proxy  
                let subTree = instance.subTree = instance.render.call(proxyToUse, proxyToUse);

                // 用render函数的返回值 继续渲染
                patch(null, subTree, container);
                instance.isMounted = true;
            } else {
                // diff算法  （核心 diff + 序列优化 watchApi 生命周期）  
                // ts 一周
                // 组件库
                // 更新逻辑
                const prevTree = instance.subTree;
                let proxyToUse = instance.proxy;
                const nextTree = instance.render.call(proxyToUse,proxyToUse);
                // console.log('tree',prevTree,nextTree,container);
                patch(prevTree,nextTree,container);
            }
        },{
            scheduler:queueJob
        });
    }
    const mountComponent = (initialVNode, container) => {
        // 组件的渲染流程  最核心的就是调用 setup拿到返回值，获取render函数返回的结果来进行渲染 
        // 1.先有实例
        const instance = (initialVNode.component = createComponentInstance(initialVNode))
        // 2.需要的数据解析到实例上
        setupComponent(instance); // state props attrs render ....
        // 3.创建一个effect 让render函数执行
        setupRenderEfect(instance, container);
    }
    const processComponent = (n1, n2, container) => {
        if (n1 == null) { // 组件没有上一次的虚拟节点
            mountComponent(n2, container);
        } else {
            // 组件更新流程 
        }
    }
    // ------------------组件 ------------------


    //----------------- 处理元素-----------------
    const mountChildren = (children, container) => {
        for (let i = 0; i < children.length; i++) {

            let child = normalizeVNode(children[i]);
            patch(null, child, container);
        }
    }
    const mountElement = (vnode, container,anchor=null) => {
        // 递归渲染
        const { props, shapeFlag, type, children } = vnode;
        let el = (vnode.el = hostCreateElement(type));

        if (props) {
            for (const key in props) {
                hostPatchProp(el, key, null, props[key]);
            }
        }
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children);// 文本比较简单 直接扔进去即可
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el);
        }
        hostInsert(el, container,anchor);
    }

    const patchProps = (oldProps,newProps,el) => {
        if(oldProps !== newProps) {
            for(let key in newProps){
                const prev = oldProps[key];
                const next = newProps[key];
                if(prev !== next) {
                    hostPatchProp(el,key,prev,next);
                }
            }
            for(let key in oldProps) {
                if(!(key in newProps)) {
                    hostPatchProp(el,key,oldProps[key],null);
                }
            }
        }
    }

    // ++++++++++ diff 核心算法函数 ++++++++++
    const patchKeyChildren = (preChildren,newChildren,el) => {
        // vue3 对特殊情况进行优化
        /**
         * 1、当两个元素完全相同，就没必要进行对比了
         */

        /**
         * 1、都是默认从头开始对比
         * 2、创建一个指针，知道每个元素结尾
         */

        let i = 0;
        let e1 = preChildren.length - 1;
        let e2 = newChildren.length - 1;

        // 尽可能减少比对对范围
        // sync from start: 有可能两个数组是这样的：[a,b,c] [a,b,d,e] 这样 两个数组从左向右比  
        while(i<=e1 && i<=e2) {
            const n1 = e1[i];
            const n2 = e2[i];

            if(isSameVNodeType(n1,n2)){ // 如果n1与n2是同一个类型
                patch(n1,n2,el); // 比孩子
            } else {
                break;
            }
            i++;
        }

        // sync from end: 有可能两个数组是这样的：[a,b,c] [c,b,d,e]] 这样 两个数组从右向左比 
        while(i<=e1 && i<=e2) {
            const n1 = e1[i];
            const n2 = e2[i];

            if(isSameVNodeType(n1,n2)){ // 如果n1与n2是同一个类型
                patch(n1,n2,el); // 比孩子
            } else {
                break;
            }
           e1--;
           e2--;
        }

        // 说明老的少，新的多
        if(i > e1) {
           if( i <= e2) { // 表示有新增的部分
              while(i<=e2) {
                // 想知道是向前插入，还是向后插入
                const nextPos = e2 + 1;

                //                             向后插入
                const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null

                patch(null,e2[i],el,anchor);
                i++;
              }  
           }
        }
        
    }

    const unmountChildren = (children) => {
        for(let key in children) {
            unmount(children[key])
        }
    }

    const patchChildren = (oldEl,newEl,el) => {
        const c1 = oldEl.children;
        const c2 = newEl.children;

        /**
         * - 老的有儿子，新的没儿子
         * - 老的没儿子，新的有儿子
         * - 新老都有儿子
         * - 新老都是文本
         */
        /**
         * 新组件是文本：
         *  - 老组件为数组：卸载老组件
         *   - 老组件为文本：直接把文本替换掉
         *  新组件不是文本：
         *      - 老组件是数组：
                  - 新组件是数组
                  - 新组件是元素
                - 老组件不是数组：
                  - 老组件是文本
                  - 新组件是数组
         */
        const prevShapeFlag = c1.shapeFlag;
        const shapeFlag = c2.shapeFlag;
        
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) { // 如果新的是文本
            // 1、还有一种情况：老的是n个孩子，但是新的是文本
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 老的是一个数组的话
                unmountChildren(c1); // 如果c1中包含组件，会调用组件的销毁方法
            }
            // 2、如果新的是文本，老的也是文本，直接把文本替换掉
            if(c2 !== c1) {
                hostSetElementText(el,c2);
            }
        } else { // 新组件是元素,不是文本
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 老组件不是文本是数组情况
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 新组件也是数组
                    // 新组件是数组，老组件也是数组
                    // 两个数组的对比 --》diff 算法
                   
                    patchKeyChildren(c1,c2,el);

                } else { // 老组件是数组，并且新组件没有孩子，删除老组件的孩子
                    unmountChildren(c1);
                }
            } else { // 老组件不是数组，可能为文本
                if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN) { // 老组件是文本
                    // 清空老组件的文本内容
                    hostSetElementText(el,'');
                }
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 新组件是数组
                    // 将元素挂载上去
                    mountChildren(c2,el);
                }
            }
        }
    }

    const patchElement = (n1,n2,container) =>{
        // 元素是相同节点
        let el = (n2.el = n1.el);

        // 更新属性  更新儿子
        const oldProps = n1.props || {};
        const newProps = n2.props || {};
        patchProps(oldProps,newProps,el);
        
        patchChildren(n1,n2,el);
    }
    const processElement = (n1, n2, container,anchor) => {
        debugger
        if (n1 == null) {
            mountElement(n2, container,anchor);
        } else {
            // 元素更新
            patchElement(n1,n2,container);
        }
    }
    //----------------- 处理元素-----------------

    // -----------------文本处理-----------------
    const processText = (n1,n2,container) =>{
        if(n1 == null){
            hostInsert((n2.el = hostCreateText(n2.children)),container)
        }
    }
    const isSameVNodeType = (n1,n2) => {
        return (n1.type === n2.type) && (n1.key === n2.key);
    }

    const unmount = (n1) => { // 如果是组件，调用的组件的生命周期 
        hostRemove(n1.el);
    }

    // -----------------1、 文本处理-----------------
    const patch = (n1, n2, container,anchor=null) => {
        // 针对不同类型 做初始化操作
        const { shapeFlag,type } = n2;

        /**
         * 当n1与n2都是元素的时候，根本就不用去比较，直接用n2替换n1就可以了
         *  - 判断两个元素是否相同，只需判断元素的key,type是否相同
         */
        if(n1 && !isSameVNodeType(n1,n2)) {
            // 把以前的删掉，换成n2
            anchor = hostNextSibling(n1.el);
            unmount(n1);
            n1 = null; // 重新渲染n2对应的内容
        }

        switch (type) {
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container,anchor);
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container);
                }
        }
       
    }
    const render = (vnode, container) => {
        // core的核心, 根据不同的虚拟节点 创建对应的真实元素

        // 默认调用render 可能是初始化流程
        patch(null, vnode, container)
    }
    return {
        createApp: createAppAPI(render)
    }
}
// createRenderer 目的是创建一个渲染器

// 框架 都是将组件 转化成虚拟DOM -》 虚拟DOM生成真实DOM挂载到真实页面上


// 