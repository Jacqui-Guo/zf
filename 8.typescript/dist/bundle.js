(function () {
    'use strict';

    // console.log(str);
    var tuple = ['1', true, 1];
    tuple.pop(); // 删除并返回数组的最后一个元素，pop会改变原数组
    // r1的数据类型可以是：string,boolean,number,undefined
    // push的数据类型只要在已经定义的类型中就可以，可以push多个数据
    tuple.push('str', 4, 5, 6, false); // push的时候 可以放入元组中定义的类型
    // tuple[2]=false; // 不能通过索引更改元组
    console.log(tuple);
    /**
     * 元组的使用场景；
     *  - 数据交换
     */
    function fun(obj) {
        console.log(obj);
    }
    fun({ a: 1 });
    fun([1]);
    var ROLE;
    (function (ROLE) {
        ROLE[ROLE["ADMIN"] = 0] = "ADMIN";
        ROLE[ROLE["MAMAGE"] = 1] = "MAMAGE";
        ROLE[ROLE["USER"] = 2] = "USER";
    })(ROLE || (ROLE = {}));
    console.log(ROLE.ADMIN);

}());
//# sourceMappingURL=bundle.js.map
