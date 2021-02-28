import { isFunction } from './../../shared/src/index';
import { effect, track, trigger } from './effect';
import { TrackOpTypes, TriggerOrTypes } from './operators';

// vue2 和 vue3 computed的原理是不一样的
/**
 * vue2 中计算属性是不具有收集依赖的功能的
 * vue3 中计算属性也要收集依赖
 * 计算属性本身就是一个effect
 */

/** 
 * computed(()=>{
 *  return 1;
 * })
 * computed({
 *  get value(){}
 *  set value(){}
 * })
 */

class ComputedRefImpl {
    public _dirty = true; // 默认取值时不要用缓存
    public _value; // 存储数据的中间件
    public effect;
    constructor(getter,public setter) { // ts中默认不会挂载到this上，但是可以加public关键字，这样就挂载到了this上
        this.effect = effect(getter,{
            lazy: true, // 因为计算属性默认时不执行的
            scheduler: () => { // 用户设置数据，重新执行effect
                if(!this._dirty) {
                    this._dirty = true;
                    trigger(this,TriggerOrTypes.SET,'value'); // 触发更新
                }
            }
        });
    }
    get value() { // 计算属性也要收集依赖
       if(this._dirty) {
        this._value = this.effect(); // 将用户的返回值返回
        this._dirty = false;      
       }
       // 做依赖收集，只要访问了 【自己】 的 【value】 ,就把数据给收集起来
       track(this,TrackOpTypes.GET,'value')
        return this._value;
    }
    set value(newValue) {
        this.setter(newValue);
    }
}

export function computed(getterOrOptions) {
    let getter;
    let setter;
    // 1
    debugger
    if(isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => {
            console.warn('computed value mast be readonly');
        }
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    // 2
    // 取computed中值的时候 xxx.value => 与ref类似
    return new ComputedRefImpl(getter,setter);
}