// 返回元素的 第几行，第几列，偏移
export const getCursor = (content) => {
    let {line,column,offset} = content;     
    return {line,column,offset}
}
// 把content.source中的内容删掉
export const advanceBy = (content,endIndex) => {
    let s = content.source;

    // 计算出一个新的结束位置
    // 根据内容和结束的索引来修改上下文的信息
    advancePositionWithMutation(content,s,endIndex);

    content.source = s.slice(endIndex);
}

// 更新 行，列，偏移量
const advancePositionWithMutation = (content,s,endIndex) => {
    // s 之前的内容

    // 如何更新是第几行？
    let linesCount = 0;
    let linePos = -1; // 列的位置
    for(let i = 0;i<endIndex;i++) {
        // charCodeAt 获取字符的 unicode 编码 \n 对应的unicode编码为10
       if(s.charCodeAt(i) == 10) { // 遇到 \n 符号
          linesCount++;  
          linePos=i;
       }
    }
    // 更新列数
    // 更新偏移量
    content.line += linesCount;
    content.column = linePos == -1 ? content.column + endIndex : endIndex - linePos; 
    content.offset += endIndex;
}

// 解析文本数据
export const parseTextData = (content,endIndex) => {
    const rawText = content.source.slice(0,endIndex);
    advanceBy(content,endIndex); // 在 content.source 中把文本内容删除掉
    return rawText;
}
