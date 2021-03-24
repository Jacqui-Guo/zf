import { computed, defineComponent,h, inject } from 'vue'

export default defineComponent({
    name: "ZCol",
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        span: { //栅格占据列数
            type: Number,
            default: 24
        },
        offset: { //栅格左侧的间隔数
            type: Number,
            default: 0
        }
    },
    setup(props,{slots}) {
        // 根据父组件的 gutter 设置每个子元素的 gutter
        const gutter = inject('ZRow',0);



        const classs = computed(() => {
            const ret = [];
            const pos = ['span','offset'] as const;

            pos.forEach((item) => {
                const size = props[item];
                if(typeof size == 'number' && size > 0) {
                    ret.push(`z-col-${item}-${props[item]}`)
                }
            })
            return [
                'z-col',
                ...ret
            ]
        })

        const styles = computed(() =>{
            if(gutter !== 0) {
                return {
                    paddingLeft: `${gutter/2}px`,
                    paddingRight: `${gutter/2}px`
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

