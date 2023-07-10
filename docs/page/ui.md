# UI

`xt`框架在 `cc.Component`的基础上封装了 `XTComponent`组件，用来做一些定制化的功能，XTComponent组件提供了一些动态注册按钮事件、创建节点、动态加载图片等方法

整套UI框架也是基于XTComponent集成而来

## BaseUI

UI基类

## CommonUI

通用UI基类，继承自BaseUI拥有创建插件UI的功能

## WindowUI

全屏窗口类型的UI，继承自CommonUI

## PopUI

弹窗类型的UI，继承自CommonUI

## PluginUI

插件类型的UI，继承自CommonUI，可以由继承自CommonUI的UI管理，由于本身也是继承自CommonUI，所以可以实现各种将各个小型界面拼接。主要用于分页功能、多页签、多个小型页面拼接等逻辑

## ItemUI

小型UI，继承自BaseUI，常作为物品Item、人物头像的基类
