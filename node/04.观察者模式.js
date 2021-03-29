// 通俗的讲：就是 当前我的状态变化了，通知依赖当前状态的人，去更新状态

// vue 数据变了(状态变了)，视图要更新(通知依赖的人)

/**
 * 被观察者需要将观察者收集起来
 */

// 被观察者的类
class Subject{
    constructor(name) {
        this.name = name;
        this.state = '哈哈哈';
        this.observer = [];
    }

    attch(o) {
        this.observer.push(o)
    }

    setState(newState) {
        this.observer.forEach(o => {
            o.update(newState,this.name)
        })
    }
}

// 观察者的类
class Observer {
    constructor(name) {
        this.name = name;
    }
    update(state,_name){
        console.log(`${_name}说：${this.name} ${state}`) // 被观察者去发布
    }
}

let baby = new Subject('宝宝')

let o1 = new Observer('father')
let o2 = new Observer('mother')

// 订阅(被观察者将观察者收集起来)
baby.attch(o1)
baby.attch(o2)

// 发布
baby.setState('我饿了')