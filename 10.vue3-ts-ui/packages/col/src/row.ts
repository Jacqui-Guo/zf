import { computed, defineComponent,h, provide } from 'vue'

export default defineComponent({
    name: "ZRow",
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        gutter: { // 间距
            type: Number,
            default: 0
        },
        justify: { // 水平or 垂直
            type: String,
            default: 'start' // flex-start flex-end
        },
    },
    setup(props,{slots}) {
        
        // 提供给，所有子组件都能使用这个属性
        provide('ZRow',props.gutter);
        
        const classs = computed(() => [
            'z-row',
            props.justify !== 'start' ? `is-justify-${props.justify}` : ''
        ])

        // 去除最外层盒子，左右的margin值
        const styles = computed(() => {
            if(props.gutter) {
                return {
                    marginLeft: `-${props.gutter/2}px`,
                    marginRight: `-${props.gutter/2}px`
                }
            }
        })



        // 标签名，属性，插槽(slots.default?.() ts 的写法，如果 slots.default存在就调用()，不存在 就 不调用)
        return () => h(props.tag,{
            class: classs.value,
            style: styles.value
        },slots.default?.())
    },
})
