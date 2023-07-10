# EventManager

`xt.eventManager`是一个全局事件管理类，可以将一些网络、UI事件等等注册在这里

注意点：同一个事件触发的回调调用顺序是**不固定的**

## 主要用法：

```js
xt.eventManager.on('a', this.cb1, this); //监听事件
xt.eventManager.once('a', this.cb1, this); //单次监听事件
xt.eventManager.off('a', this.cb1, this); //取消监听事件
xt.eventManager.emit('a'); //派发事件
xt.eventManager.offByTarget(this); //取消该对象上的所有事件
```
