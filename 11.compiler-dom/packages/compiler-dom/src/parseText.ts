import { getCursor, parseTextData } from "./common";
import { NodeTypes } from "./NodeTypes";

const getSelection = (content,start) => {
    let {line,column,offset,source} = content;
    return {
        start: {...start},
        end: {line,column,offset},
        source
    }
}

export const parseText = (content) => {
    const endTokens = ['<','{{'];
    let endIndex = content.source.length; // 文本的长度

    // 假设法： 先假设遇到 < 是结尾，再拿到遇到 {{ 去比较哪个在前，就是到哪
    // hello<div>aaa</div>{{test}} 文本字符串应该是<div> 之前的内容，不是 {{ 之前的内容 
    // 获取文本的结束信息
    for(let i = 0;i < endTokens.length;i++) {
       const index = content.source.indexOf(endTokens[i],1); // hello, 从 e 开始去查找
       if(index !== -1 && index < endIndex) {
           endIndex = index; 
       }
    }

    // 有了文本的结束位置，就可以更新行列信息 
    let start = getCursor(content);
    const _content = parseTextData(content,endIndex)
    console.log('_content',_content);
    return {
        type:NodeTypes.TEXT,
        content: _content,
        loc: getSelection(content,start)
    }
}