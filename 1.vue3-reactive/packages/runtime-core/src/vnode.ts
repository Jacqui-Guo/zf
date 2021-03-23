// 根据组件创建虚拟节点

import { isArray, isObject, isString } from "@vue/shared/src";
import { ShapeFlags } from "packages/shared/src/shapeFlag";

// h('div',{style:{color:red}},'children') h方法与createApp方法类似
export const createVNode = (type,props,children = null) => {
    // createVNode 接受的第一个参数有两种：1，component 2,传入的值可能是普通元素
    // 给虚拟节点加一个类型
    const shapeFlag = isString(type) ? 
        ShapeFlags.ELEMENT : isObject(type) ? 
        ShapeFlags.STATEFUL_COMPONENT : 0;

    // 根据type来区分是组件(对象)，还是普通元素(字符串)
    const vnode = { // 创建一个对象来描述对应的内容，虚拟节点有跨平台的能力
        __v_isVnode: true,
        type,
        props,
        children,
        component: null, // 存储组件对应的实例
        el:null, // 稍后会将虚拟节点和真实节点对应起来
        key: props && props.key, // diff算法会用到key
        shapeFlag 
    }
    // 判断出当前自己的类型和儿子的类型
    normalizeChildren(vnode,children);
    return vnode;
}

function normalizeChildren(vnode,children) {
    let type = 0;
    if(children === null) {

    } else if(isArray(children)) {
        type = ShapeFlags.ARRAY_CHILDREN
    } else {
        type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.shapeFlag = vnode.shapeFlag | type; // 自己与儿子的类型取 ｜ 运算
    /**
     * 为什么要拿自己和自己儿子的类型取 ｜ 运算？
     *   因为得出的结果包含 自己是什么类型，自己的儿子是什么类型
    */ 
}