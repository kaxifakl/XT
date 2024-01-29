import { _decorator, Button, Component, Node, Sprite } from 'cc';
import { WindowUI } from '../../xt/core/ui/src/window-ui';
const { ccclass, property } = _decorator;

declare global {
    interface IUI { MainUI: typeof MainUI }
    namespace xt.ui { type MainUI = InstanceType<typeof MainUI> }
}

@xt.prefabUrl('prefab/MainUI')
@ccclass('MainUI')
export class MainUI extends WindowUI {

    @property({
        displayName: '@testBtn',
        type: Button
    })
    private testBtn: Button = null;

    @property({
        displayName: '@SpriteSplash',
        type: Sprite
    })
    private sp: Sprite = null;

    @property({
        displayName: 'sp2',
    })
    private num: number = 0;

    @property({
        displayName: 'sp3',
    })
    private str2: string = '';

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