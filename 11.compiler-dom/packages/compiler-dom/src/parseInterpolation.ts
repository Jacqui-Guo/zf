import { advanceBy, advancePositionWithMutation, getCursor, parseTextData ,getSelection} from "./common";
import { NodeTypes } from "./NodeTypes";

// 解析表达式
export const parseInterpolation = (content) => {
    let contentInfo = getCursor(content);
    const closeIndex = content.source.indexOf('}}','{{'); // 从 {{ 开始进行查找，找 }}
  
    // 将{{NAME}} 变为 NAME}}
    advanceBy(content,2) // 修改content.source中的内容， 删除前面的两位   
    let innerStart = getCursor(content);
    let innerEnd = getCursor(content);
    
    // NAME}} 变为 NAME 即 拿到 {{ }} 里面的内容
    const rawContentLength = closeIndex - 2; 
    const preTrimContent = parseTextData(content,rawContentLength)

    //  去掉前后空格
    const _context = preTrimContent.trim();

    // 计算偏移量 “   name   ”

    // 计算开始的偏移量 即：计算 “    name” name前面这段空格距离name的偏移量 = name 的索引

    const startOffset = preTrimContent.indexOf(_context);
    if(startOffset > 0) { // 说明前面有空格
        advancePositionWithMutation(innerStart,preTrimContent,startOffset)
    }

    // 再去更新 "   name" 从开头(包含空格) + name 的位置
    const endOffset = _context.length + startOffset;
    advancePositionWithMutation(innerEnd,preTrimContent,endOffset);
    advanceBy(_context,2);
    debugger
    return {
        type: NodeTypes.INTERPOLATION,
        conten: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            isStatic: false,
            loc: getSelection(_context,innerStart,innerEnd)
        },
        loc: getSelection(_context,innerStart)
        
    }

}