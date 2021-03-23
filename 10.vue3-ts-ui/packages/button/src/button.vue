<template>
    <button>按钮</button>
</template>


<script lang="ts">
import { defineComponent,PropType } from 'vue'

type IButtonType = "primary" | "warning" | "danger" | "default" | "info" | "success"

export default defineComponent({
    name:'ZButton',
    props: {
        type: String as PropType<IButtonType>
    },
    setup(props,ctx) {

    }
})
</script>
