# Loader

`xt`框架使用 `AssetLoader`作为资源加载器来加载资源，每个loader只会管理自己所加载的资源，`AssetLoader`不可以单个释放已经加载的资源，只能整体处理自己加载的资源

`LoaderManager`是loader的管理类，包括 `getLoader`获取loader方法和 `releaseLoader`释放loader方法

## 主要用法：

```js
//通过自定义的key获取一个loader,用这个loader加载一个资源
let loader = xt.loaderManager.getLoader('custom');
loader.load('res/ui/test.png', SpriteFrame, (res) => {
    console.log(res);
})

//当这个loader不再需要的时候进行释放,同时会对该loader加载的资源减引用计数
xt.loaderManager.releaseLoader(loader);

//当然可以这样初始化loader,这时候loader需要自己来管理释放
let loader2 = new xt.AssetLoader('custom2')
loader2.release();
```
