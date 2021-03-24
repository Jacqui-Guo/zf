export interface ICheckboxProps {
    indeterminate?: boolean, // 是否半选
    checked?: boolean, // 是否选中
    name?: string,
    disabled?: boolean,
    label?: string | number | boolean, // 选中状态的值
    modelValue?: string | number, // 绑定checkbox的值
}