组件库的打包格式有哪些
1. 整个打包了 umd
2. esModule
3. 组件的按需加载 需要把每个文件 单独打包


响应式布局的原理：栅格化布局

代码发布流程：lerna publish 发布，需要先将代码提交到github

lerna create checkbox 
lerna create checkbox-group 

checkbox/src/checkbox.vue & checkbox-group.vue

1. checkbox.vue
   <template>
      <div class="z-checkbox">
         
      </div>
   </template>
   name: 'ZCheckbox'
   props: {
      name: String,
      indeterminate: Boolean,
      checked: Boolean,
      label: [String,Number,Boolean],
      ...
   }
   setup(props,{slots}) {
      props.modelValue
   }

2. checkbox/src/checkbox-types.ts 存储类型的文件
   export interface ICheckboxProps {
       indeterminate?: Boolean, // 是否半选
       checked?: Boolean, // 是否选中
       name?:string,
       disabled?:  Boolean,
       label?: string | number | boolean, // 选中状态的值
       modelValue?: string | number, // 绑定checkbox的值
   }
