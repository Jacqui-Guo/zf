// global.c = 2
// 即使 变量 c 没有使用 module.exports, 在其他js文件中，在 global 上也可以找到 c

module.exports = {
    a: 1,
    b: 2
}