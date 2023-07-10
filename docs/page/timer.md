# TimerManager

`xt.timerManager`是计时器管理类

## 主要用法：

```js
//创建一个计时器,每过1秒打印log,返回值为计时器的id
let timerId = xt.timerManager.addTimer(1, () => {
    console.log('timer');
})

//根据计时器id移除该计时器
xt.timerManager.removeTimer(timerId);

//创建一个一次性的计时器,计时器会在1秒后触发回调,然后自动移除
xt.timerManager.addTimer(1, () => {
    console.log('once');
}, true)
```
