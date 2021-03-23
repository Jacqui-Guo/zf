export const patchStyle = (el,prev,next) => {
    let style = el.style;
    if(next == null) { // 用户删除样式
        el.removeAttribute('style');
    } else {
        if(prev) {
            for(const key in prev) {
                if(next[key] == null) { // 老的里面有，新的里面没有
                    style[key] = '';            
                }
            }
        }
        // next 中的数据，赋值到style上
        for(const key in next) {
            style[key] = next[key];
        }
    }
}