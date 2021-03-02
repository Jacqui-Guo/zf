import { isArray, isObject, isString, ShapeFlags } from "@vue/shared/src"

export const createVNode = (type,props,children = null) => {
    // 根据type 来区分是组件(对象)， 还是普通的元素(字符串)

    // 给虚拟节点加一个类型

    /**
     * 什么叫虚拟节点？
     *  就是用一个对象来描述对应的内容，
     *  虚拟节点有跨平台的能力
     */
    
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0; 

    const vnode = {
        __v_isVnode: true, // 标识：是一个vnode
        type,
        props,
        children,
        component: null, //存放组件对应的实例  -》 实例根据组件创建
        el: null, // 将虚拟节点和真实dom做一个映射
        key: props && props.key, // key 主要用于diff算法
        shapeFlag
    }

    /**
     * 如果是一个元素，需要判断当前元素的儿子，eg: 当前元素下有两个子节点
     *   <div> span p </div>
     * 
     * 如果是一个组件，组件里面可能没有子节点，或者 组件里面有slot插槽
     * 
     */
    normalizeChildren(vnode,children);
    return vnode;
}

function normalizeChildren(vnode,children) {
    let type = 0;
    if(children == null) {

    } else if(isArray(children)) {
        type = ShapeFlags.ARRAY_CHILDREN;
    } else {
        type = ShapeFlags.TEXT_CHILDREN;
    }
    /**
     * 为什么用自己和自己的儿子做 或 运算？
     *   + 因为这样就可以区分自己是什么类型，自己的儿子是什么类型了 
     */

     vnode.shapeFlag = vnode.shapeFlag | type;
}