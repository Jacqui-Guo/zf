<template>
  <div class="z-checkbox">
      <span class="z-checkbox__input" >
          <input type="checkbox" 
            v-model="model"
            :checked="isChecked"
            @change="handleChange" />
      </span>
      <span class="z-checkbox__label">
          <slot></slot>
      </span>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import {useCheckbox} from './useCheckbox.ts';

export default defineComponent({
  name: "ZCheckbox",
  props: {
    name: String,
    indeterminate: Boolean,
    checked: Boolean,
    disabled: Boolean,
    label: [String, Number, Boolean],
    modelValue: [String, Number,Boolean]
  },
  // 子组件触发的事件
  emits: ['update:modelValue','change'],
  setup(props) {
    return useCheckbox(props)
  },
});
</script>
