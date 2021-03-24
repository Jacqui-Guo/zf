<template>
  <div class="z-checkbox">
      <span class="z-checkbox__input" >
           <input type="checkbox" />
      </span>
      <span class="z-checkbox__label">
          <slot></slot>
      </span>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ZCheckbox",
  props: {
    name: String,
    indeterminate: Boolean,
    checked: Boolean,
    disabled: Boolean,
    label: [String, Number, Boolean],
    modelValue: [String, Number]
  },
  setup() {},
});
</script>
