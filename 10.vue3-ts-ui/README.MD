组件库的打包格式有哪些
1. 整个打包了 umd
2. esModule
3. 组件的按需加载 需要把每个文件 单独打包


响应式布局的原理：栅格化布局

1. lerna create col 
2. lerna create row


col/row.ts & col.ts & index.ts
row/index.ts

3. col.ts
import {defineComponent} from 'vue

name: "Col"
props: {
    tag: {
        type: String,
        default: 'div'
    }
},
setup(){
    // 标签名，属性，插槽(slots.default?.() ts 的写法，如果 slots.default存在就调用，不存在 就 ())
    return () => h(props.tag,{},slots.default?.())
}

row.ts 同上

4. col/index.ts

import Col from './src/col'
Col.install = (app:App):void => {
    app.component(Col.name,Col)
}
export default Col

row/index.ts 同上

5. z-ui 中 去注册
6. lerna publish 发布，需要先将代码提交到github
7. 