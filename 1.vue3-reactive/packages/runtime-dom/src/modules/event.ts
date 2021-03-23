
// 这个函数的目的主要是解决给一个元素已经添加了事件，当事件函数发生变化的时候，将变化的函数，还绑定在原来的元素上
function createInvoker(value) {
    const invoker = (e) => {
        invoker.value(e);
    }
    invoker.value = value;
    return invoker;
}

/**
 * @param el 绑定事件的元素
 * @param key 事件名
 * @param value 事件
 */
// vei: vue events invoker vue的事件调用
export const patchEvent = (el,key,value) => {
    // 缓存事件列表
    let invokers = (el._vei || (el._vei = {}));
    let exist = invokers[key];
    let eventName = key.slice(2).toLowerCase(); // onClick => click

    // 如果用户传递了事件函数，并且该函数已经被缓存过
    if(value && exist) {
        exist.value = value;
    } else {
        if(value) { // 说明之前没有为元素绑定过事件
            let invoker = invokers[key] = createInvoker(value);
            el.addEventListener(eventName,invoker);
        } else { // 说明要删除元素对应的事件
            el.removeEventListener(eventName,exist)
            invokers[key] = undefined;
        }
    }

}