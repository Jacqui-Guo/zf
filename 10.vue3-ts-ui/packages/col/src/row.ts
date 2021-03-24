import { defineComponent,h } from 'vue'

export default defineComponent({
    name: "ZRow",
    props: {
        tag: {
            type: String,
            default: 'div'
        }
    },
    setup(props,{slots}) {
        // 标签名，属性，插槽(slots.default?.() ts 的写法，如果 slots.default存在就调用，不存在 就 ())
        return () => h(props.tag,{},slots.default?.())
    },
})
