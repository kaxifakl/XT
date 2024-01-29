import { _decorator, Button, Component, Label, Node, Sprite } from 'cc';
import { WindowUI } from '../../xt/core/ui/src/window-ui';
import { QuickBind } from '../../xt/extern/x-bind/quick-bind';
const { ccclass, property } = _decorator;

declare global {
    interface IUI { MainUI: typeof MainUI }
    namespace xt.ui { type MainUI = InstanceType<typeof MainUI> }
}

@xt.decorator.setPrefab('prefab/MainUI')
@ccclass('MainUI')
export class MainUI extends WindowUI {

    @QuickBind('testBtn', Button)
    private testBtn: Button = null;

    @QuickBind('SpriteSplash', Sprite)
    private sp: Sprite = null;

    @QuickBind('a', Label)
    private test: Label = null;

    start() {
        xt.eventManager.on('a', this.cb2, this); //监听事件
        xt.eventManager.once('a', this.cb2, this); //单次监听事件
        xt.eventManager.emit('a'); //派发事件
        xt.eventManager.offByTargetAndKey(this, 'a');

        this.scheduleOnce(() => { this.close() }, 3)
    }

    cb1(a, b, c, d, e) {

    }

    cb2() {
        console.log(1);
    }

    update(deltaTime: number) {

    }

    public onClose() {
        console.log('close')
    }
}

xt.ui.MainUI = MainUI;