
export const nodeOps = {
    // createElement  不同的平台创建元素的方式不同
    // 小程序，浏览器创建元素的方式是不同的

    // 元素：增删改查
    createElement: element => document.createElement(element),
    removeElement: child => {
        const parent = child.parentNode;
        if(parent) {
            parent.removeChild(child)
        }
    },
    insertElement: (element,parent,anchor = null) => { // 第三个参数，参照物
        parent.insertBefore(element,anchor); // 当anchor为null的时候，相当于appendChild
    },
    querySelector: selector => document.querySelector('selector'),
    setElementText: (el, text) => el.textContent = text,
    // 文本操作 创建文本 
    createText: text => document.createTextNode(text),
    setText: (node, text) => node.nodeValue = text

}