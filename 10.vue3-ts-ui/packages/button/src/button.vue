<template>
    <button :class="classs" @click="childBtn">
        <i v-if="icon && !loading" :class="icon"></i>
        <i v-if="loading && !icon" class="z-icon-loading"></i>
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>


<script lang="ts">
import { computed, defineComponent,PropType } from 'vue'

type IButtonType = "primary" | "warning" | "danger" | "default" | "info" | "success"

export default defineComponent({
    name:'ZButton',
    props: {
        type: {
            type: String as PropType<IButtonType>,
            default: 'primary',
            vaildator: (val:string) => {
                return [
                    "primary", "warning", "danger", "default", "info", "success"
                ].includes(val)
            }
        },
        icon: {
            type: String,
            default: '' 
        },
        disabled: Boolean,
        loading: Boolean,
        round: Boolean,
    }, 
    emits: ['click'],
    // ctx 是当前组件上下文
    setup(props,ctx) { // 我们所有的组件都不会用optionsApi，全部采用compositionApi
        const classs = computed(() => [
            'z-button',
            'z-button--'+props.type,
            {
                'is-disabled': props.disabled,
                'is-loading': props.loading,
                "is-round": props.round
            }
        ])

        const childBtn = (e) => {
            console.log('我是子组件');
            // 子组件 触发 父组件的方法
            ctx.emit('click',e)
        }

        return {
            classs,
            childBtn
        };
    }
})
</script>
