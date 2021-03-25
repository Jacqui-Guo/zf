import { advanceBy, getCursor, parseTextData } from "./common";

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



    console.log('表达式',preTrimContent);

}