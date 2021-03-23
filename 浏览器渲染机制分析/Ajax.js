/**
 * 1、创建一个ajax对象
 * 2、建立网络链接 open
 * 3、发送请求 send
 */

function Ajax(type,data,success,failed) {
    let xhr = new XMLHttpRequest();
    let _type = type.toUpperCase()
    let _str;

    for(let key in data) {
        _str += `${key}=${data[key]}&`; 
    }

    let _url = `https://www.baidu.com`;
    // (请求类型，url,是否异步)
    if(_type === 'GET') {
        _url = `${_url}?${str}`;

        xmr.open('GET',_url,true);
        xmr.send();
    } else if(_type === 'POST') {
        xmr.open('POST',_url,true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    /**
     * 每当 readyState 值发生变化，都会触发 onreadystatechange 重新执行
     * 0 ：请求未初始化
     * 1 ：服务器连接已建立
     * 2 ：请求已接受
     * 3 : 请求处理中
     * 4 ：请求已完成，且相应就绪 
     */
    
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){ // 请求完成
            if(xhr.status == 200){
                success(xhr.responseText);
            } else {
                if(failed){
                    failed(xhr.status);
                }
            }
        }
    }
     
}