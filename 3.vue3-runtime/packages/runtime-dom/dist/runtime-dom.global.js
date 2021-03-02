var VueRuntimeDOM = (function (exports) {
    'use strict';

    const isObject = (value) => typeof value == 'object' && value !== null;
    const extend = Object.assign;
    const isArray = Array.isArray;
    const isString = (value) => typeof value === 'string';

    const createVNode = (type, props, children = null) => {
        // 根据type 来区分是组件(对象)， 还是普通的元素(字符串)
        // 给虚拟节点加一个类型
        /**
         * 什么叫虚拟节点？
         *  就是用一个对象来描述对应的内容，
         *  虚拟节点有跨平台的能力
         */
        const shapeFlag = isString(type) ? 1 /* ELEMENT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : 0;
        const vnode = {
            __v_isVnode: true,
            type,
            props,
            children,
            component: null,
            el: null,
            key: props && props.key,
            shapeFlag
        };
        /**
         * 如果是一个元素，需要判断当前元素的儿子，eg: 当前元素下有两个子节点
         *   <div> span p </div>
         *
         * 如果是一个组件，组件里面可能没有子节点，或者 组件里面有slot插槽
         *
         */
        normalizeChildren(vnode, children);
        return vnode;
    };
    function normalizeChildren(vnode, children) {
        let type = 0;
        if (children == null) ;
        else if (isArray(children)) {
            type = 16 /* ARRAY_CHILDREN */;
        }
        else {
            type = 8 /* TEXT_CHILDREN */;
        }
        /**
         * 为什么用自己和自己的儿子做 或 运算？
         *   + 因为这样就可以区分自己是什么类型，自己的儿子是什么类型了
         */
        vnode.shapeFlag = vnode.shapeFlag | type;
    }

    function createAppApi(render) {
        // 告诉他哪个组件，哪个属性来创建应用
        return function createApp(rootComponent, rootProps) {
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
                    let vnode = createVNode(rootComponent, rootProps);
                    /**
                     * 调用render方法进行渲染
                     */
                    //  let vnode = {};
                    render(vnode, container);
                    app._container = container;
                }
            };
            return app;
        };
    }

    const createComponentInstance = (vnode) => {
        const instance = {
            vnode,
        };
        return instance;
    };

    // createRenderer 目的是创建一个渲染器
    // 框架都是将组件转化成虚拟DOM -》虚拟DOM生成真实dom 挂载到真实页面上 
    function createRenderer(renderOption) {
        // +++++++++ 4 ++++++++++++++++
        // 挂载组件 (mountComponent最核心的就是调用setup/render，拿到函数返回结果来进行渲染)
        const mountComponent = (initialVnode, container) => {
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
            const instance = (initialVnode.component = createComponentInstance(initialVnode));
            console.log('xxxx', instance);
        };
        // +++++++++ 3 ++++++++++++++++
        // 处理组件
        const processMount = (oldVnode, newVnode, container) => {
            if (oldVnode == null) { // 挂载组件
                mountComponent(newVnode);
            }
        };
        // +++++++++ 2 ++++++++++++++++
        // 虚拟节点比对
        const patch = (oldVnode, newVnode, container) => {
            let { shapeFlag } = newVnode;
            if (shapeFlag & 1 /* ELEMENT */) { // 用 & 不用&& 的原因：&比&&计算快，效率更高
                console.log('元素');
            }
            else if (shapeFlag & 4 /* STATEFUL_COMPONENT */) {
                console.log('组件', shapeFlag, 4 /* STATEFUL_COMPONENT */);
                // 处理组件
                processMount(oldVnode, newVnode);
            }
        };
        // +++++++++ 1 ++++++++++++++++
        const render = (vnode, container) => {
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
            patch(null, vnode);
        };
        return {
            createApp: createAppApi(render)
        };
    }

    const nodeOps = {
        // createElement  不同的平台创建元素的方式不同
        // 小程序，浏览器创建元素的方式是不同的
        // 元素：增删改查
        createElement: element => document.createElement(element),
        removeElement: child => {
            const parent = child.parentNode;
            if (parent) {
                parent.removeChild(child);
            }
        },
        insertElement: (element, parent, anchor = null) => {
            parent.insertBefore(element, anchor); // 当anchor为null的时候，相当于appendChild
        },
        querySelector: selector => document.querySelector(selector),
        setElementText: (el, text) => el.textContent = text,
        // 文本操作 创建文本 
        createText: text => document.createTextNode(text),
        setText: (node, text) => node.nodeValue = text
    };

    const patchAttr = (el, key, value) => {
        if (value == null) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, value);
        }
    };

    const patchClass = (el, value) => {
        if (value == null) {
            value = '';
        }
        el.className = value;
    };

    // 这个函数的目的主要是解决给一个元素已经添加了事件，当事件函数发生变化的时候，将变化的函数，还绑定在原来的元素上
    function createInvoker(value) {
        const invoker = (e) => {
            invoker.value(e);
        };
        invoker.value = value;
        return invoker;
    }
    const patchEvent = (el, key, value) => {
        // 缓存事件列表
        let invokers = (el._vei || (el._vei = {}));
        let exist = invokers[key];
        let eventName = key.slice(2).toLowerCase(); // onClick => click
        // 如果用户传递了事件函数，并且该函数已经被缓存过
        if (value && exist) {
            exist.value = value;
        }
        else {
            if (value) { // 说明之前没有为元素绑定过事件
                let invoker = invokers[key] = createInvoker(value);
                el.addEventListener(eventName, invoker);
            }
            else { // 说明要删除元素对应的事件
                el.removeEventListener(eventName, exist);
                invokers[key] = undefined;
            }
        }
    };

    const patchStyle = (el, prev, next) => {
        let style = el.style;
        if (next == null) { // 用户删除样式
            el.removeAttribute('style');
        }
        else {
            if (prev) {
                for (const key in prev) {
                    if (next[key] == null) { // 老的里面有，新的里面没有
                        style[key] = '';
                    }
                }
            }
            // next 中的数据，赋值到style上
            for (const key in next) {
                style[key] = next[key];
            }
        }
    };

    // 里面针对一系列的属性操作
    const patchProp = (el, key, prevValue, nextValue) => {
        switch (key) {
            case 'class':
                patchClass(el, nextValue);
                break;
            case 'style':
                patchStyle(el, prevValue, nextValue);
                break;
            default:
                if (/^on[A-Z]/.test(key)) {
                    patchEvent(el, key, nextValue);
                }
                else {
                    patchAttr(el, key, nextValue);
                }
                break;
        }
    };

    // 核心就是 提供domApi方法
    /**
     * 渲染时用到的方法
     *   处理节点操作：增删改查
     *   属性操作：添加，删除，更新样式，类，属性，事件，文本操作
     */
    extend({ patchProp }, nodeOps);
    /**
     * @param rootComponent 根组件
     * @param rootProps 根属性
     * <div id="#app"></div>
     * let app = { render() {} }
     * createApp(app,{name:'zs',age:20}).mount('#app')
     */
    function createApp(rootComponent, rootProps = null) {
        let app = createRenderer().createApp(rootComponent, rootProps);
        let { mount } = app;
        // debugger
        app.mount = function (container) {
            container = nodeOps.querySelector(container);
            // 在渲染到页面之前，需要将容器内的内容清空
            container.innerHTML = '';
            mount(container); // 函数劫持
        };
        return app;
    }

    exports.createApp = createApp;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=runtime-dom.global.js.map
