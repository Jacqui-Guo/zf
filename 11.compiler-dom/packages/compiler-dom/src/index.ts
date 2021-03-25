import { parseElement } from "./parseElement";
import { parseInterpolation } from "./parseInterpolation";
import { parseText } from "./parseText";

const isEnd = (content) => {
    const source = content.source;
    return !source;
}

// 根据内容，做不同的处理
const parseChildren = (content) => {
    const nodes = [];
    console.log(isEnd(content));
    // 解析完毕的核心就是判断 content.source = ''
    // while(!isEnd(content)) {
    //     // 解析的内容可能是 < 标签，abc.. 文本, {{xxx}} 表达式
        const s = content.source;
        let node;
        if(s[0] == '<') { // 标签
            node = parseElement(content);
        } else if(s.startsWith('{{')) { // 表达式
            node = parseInterpolation(content);
        } else { // 文本    
            node = parseText(content)
            console.log('文本解析',node);
        }
        nodes.push(node);
    // }

    return nodes;    
}

const createParserContext = (content) => {
    return {
        line: 1, // 行
        column: 1, // 列
        offset: 0, // 偏移
        source: content, // source会被不停的修改，当source的长度变为0时解析完毕
        originalSource: content, // originalsource 不会发生变化，记录传入的内容
    }
}

const baseParse = (content) => {
  // 标识节点的信息，行，列，偏移量
  // 每解析一段就删除一段
  const context = createParserContext(content);  

  parseChildren(context);
}

export const baseCompiler = (template) => {
    // 将模版转换成ast语法树
    const ast = baseParse(template);
    return ast;
}