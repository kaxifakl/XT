## UIManager

xt.uiManager是UI框架的管理类，其内部主要调用UIContainer容器来处理各种UI显示、隐藏逻辑，框架内置UI容器为栈容器

开发者也可以自己实现符合业务逻辑的UI容器，来处理UI的显示隐藏逻辑，大多数情况下栈容器可以满足业务开发

## ui-stack-container

UI栈容器，根据UI的类型来处理UI的显示

### 容器规则：

1.打开UI时，当前打开的页面为WindowUI时，会隐藏之前所有UI，当前打开的页面为PopUI时，不会处理之前的UI

2.关闭UI时，当前关闭的页面为WindowUI时，会自动显示之前的UI，直到上一个WindowUI(包含)，当前关闭的页面为PopUI时，普通关闭逻辑，不会处理之前的UI
