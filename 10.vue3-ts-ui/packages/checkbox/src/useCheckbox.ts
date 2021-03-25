import { computed, getCurrentInstance, WritableComputedRef } from "vue";
import { ICheckboxProps } from "./checkbox-types";
const useModel = (props:ICheckboxProps) => {
    let {emit} = getCurrentInstance(); // 获取当前组件的实例
    let model = computed({
        get() {
            return props.modelValue;
        },
        set(newVal) {
            // v-model 会被解析为 update:modelValue,所以这里绑定事件写update:modelValue
            emit('update:modelValue',newVal);
        }
    })
    return model;
}

const useCheckboxStatus = (props:ICheckboxProps,model: WritableComputedRef<unknown>) => {
    const isChecked = computed(() => {
        const val = model.value;
        return val;
    })
    return isChecked
}


const useEvent = () => {
    let {emit} = getCurrentInstance(); // 获取当前组件的实例
    const handleChange = (e:InputEvent) => {
        const target = e.target as HTMLInputElement;
        // const changeVal = target.checked ? true : false;
        emit('change',target.checked)
    }
    return handleChange;
}

export const useCheckbox = (props:ICheckboxProps) => {

    // 1、设计一个属性，这个属性采用的就是modalValue,并且还能更改，更改的时候要出发一个事件，更新数据

    // v-model 数据
    let model = useModel(props);

    // 2、需要给checkbo设置一个checked的状态，等一会我们更改checkbox选中或者取消选中需要获取checked状态

    // checked 状态
    let isChecked = useCheckboxStatus(props,model)

    // 3、创造一个change事件，可以触发绑定到自己身上的change
    let handleChange = useEvent()

    return {
        model,
        isChecked,
        handleChange
    }
}