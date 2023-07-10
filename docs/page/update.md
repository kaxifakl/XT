# UpdateManager

`xt.updateManager`是一个全局循环系统，类似全局的update模块，可以用来注册一些循环系统，而不用依赖与组件中的update

## 主要用法：

```js
//在循环系统中注册一个简单的系统,需要id、state、update三个参数
xt.updateManager.registerSystem({
    id: '123',
    state: xt.enum.UpdateState.Start,
    update(dt) {
        console.log(123);
    },
})

//注销这个循环系统
xt.updateManager.unregisterSystem('123');
```
