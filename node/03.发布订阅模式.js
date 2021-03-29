const fs = require('fs');

// 发布订阅模式，核心就是把多个方法先暂存起来，最后一次执行
const events = {
    _events: [],
    on(fn) {
        this._events.push(fn);
    },
    emit(data){
        this._events.forEach(fn => {
            fn(data)
        })
    }
}

// 订阅是有顺序的，可以采用数组来控制

let data = [];
events.on((_data) =>{
    console.log('每读取一次，就触发一次');
    data.push(_data)
    if(data.length === 2) {
        console.log('读取完成',data);
        return;
    }
})


fs.readFile('./a.txt','utf8',(err,data) =>{
    events.emit(data)
})

fs.readFile('./b.txt','utf8',(err,data) =>{
    events.emit(data)
})


// 观察者模式： 其内部实现是基于发布订阅的(发布订阅之间是没有依赖关系的)
