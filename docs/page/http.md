# HttpManager

`xt.httpManager`是常用http请求方法的封装

## 主要用法：

```js
xt.httpManager.get('www.baidu.com', {
    succCall(data) {
        console.log(data);
    },
})
xt.httpManager.post('www.baidu.com', { id: 123 }, {
    succCall(data) {
        console.log(data);
    },
})
```
