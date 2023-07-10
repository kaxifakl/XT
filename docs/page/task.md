# Task

xt框架提供了2种任务顺序处理方法，`QueueTask`队列任务和`SyncTask`异步任务

## QueueTask

`xt.QueueTask`是按顺序执行的任务处理方法

## 主要用法：

```js
//创建一个队列任务，构造函数中可以传入一些任务回调，这些任务完成时需要调用回调中的finish方法
let task1 = new xt.QueueTask([
    (finish) => { console.log(1); finish() },
    (finish) => { console.log(2); finish() },
    (finish) => { console.log(3); finish() },
], () => {
    console.log('all finish');
})

//任务未开始前可以再添加任务
task1.add((finish) => { console.log(4); finish() })

//开始任务
task1.start();

//结果:1 2 3 4 all finish
```

## SyncTask

`xt.SyncTask`是各自执行，并在所有任务执行完成后执行回调，常用来处理多个异步加载全部完成后的回调逻辑

## 主要用法：

```js
//创建一个异步的任务，并传入这些任务的key
let task2 = new xt.SyncTask(['a', 'b', 'c'], () => {
    console.log('all finish');
});

//手动调用告知某个任务已完成，当所有任务都完成后会自动调用完成回调
task2.finish('a');
task2.finish('b');
task2.finish('c');
```
