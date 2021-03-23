// 存储组件所有的方法

// 创建组件实例
export const createComponentInstance = (vnode) => {
    const instance = { // 组件的实例
        vnode,
        type: vnode.type, // 用户写的对象
        props: {}, // props attrs 有什么区别 vnode.props
        attrs: {},
        slots: {},
        ctx: {},
        data:{},
        setupState: {}, // 如果setup返回一个对象，这个对象会作为setUpstate
        render: null,
        subTree:null, // render函数的返回结果就是subTree
        isMounted: false // 表示这个组件是否挂载过
    }
    /**
     * props与attr的区别
     */
    instance.ctx = { _: instance } // instance.ctx._
    return instance;
}
// 根据组件实例初始化组件
export const setupComponent = (instance) => {

}