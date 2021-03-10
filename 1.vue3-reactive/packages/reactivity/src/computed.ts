
// vue2 和 vue3 computed的原理是不一样的
/**
 * vue2 中计算属性是不具有收集依赖的功能的
 * vue3 中计算属性也要收集依赖
 * 计算属性本身就是一个effect
 */

import { isFunction } from "@vue/shared/src";
import { effect, track, trigger } from "./effect";
import { TrackOpTypes, TriggerOrTypes } from "./operators";


class ComputedRefImpl {
    public _dirty = true; // 默认取值时不用缓存
    public _value;
    public effect;
    constructor(getter,public setter) {
        // 第一次取值的时候默认 _dirty = true,会执行getter
        this.effect = effect(getter,{ // 计算属性默认会产生一个effect
            lazy: true, // 计算属性默认不执行
            scheduler: () => { // 当缓存的数据发生变化时
                if(!this._dirty) {
                    this._dirty = true;

                    /**
                     * 当父级函数中子属性更新了，除了更新子属性自己，还要通知父级函数收集的依赖进行更新 
                     */
                    trigger(this,TriggerOrTypes.SET,'value')

                }
            }
        })
    }

    get value() { // 计算属性也要收集依赖
        if(this._dirty) {
            this._value = this.effect(); // 会将用户的返回值返回
            this._dirty = false;
        }

        /**
         * 第一个参数是收集自己
         *  取值的过程中，让父级函数也可以收集到自己，所以要进行依赖收集
         */

        track(this,TrackOpTypes.GET,'value'); 
        // track是为了防止 effect(() => { computedInstance.age }) computedInstance.age = 20

        return this._value;
    }
    // myAge.value=30 会掉 set
    set value(newVal) {
        this.setter(newVal);
    }
}




/** 
 * computed(()=>{
 *  return 1;
 * })
 * computed({
 *  get value(){}
 *  set value(){}
 * })
 */

export function computed(getterOrOptions) {
    let getter;
    let setter;
    if(isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => {
            console.warn('computed value must be readonly');
        }
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter,setter);
}