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
        displayName: '',
        type: Button
    })
    private testBtn: Button = null;

    @property({
        displayName: '',
        type: Sprite
    })
    private sp: Sprite = null;

    start() {
        
        xt.eventManager.on('a', this.cb1, this);

        xt.eventManager.emit('a', 1, 2, 3, 4, 5)
        xt.warn('123')

        this.registerBtnClickEvent(this.testBtn, this.cb2)
        this.registerBtnClickEvent(this.testBtn, this.cb1)

        this.loadSpriteFrame(this.sp, 'texture/1')
    }

    cb1(a, b, c, d, e) {
        console.log(a, b, c, d, e);
        console.log('cb1');
        console.log(this);
    }

    cb2() {
        console.log('cb2');
        this.unregisterBtnClickEvent(this.testBtn, this.cb2)
    }

    update(deltaTime: number) {

    }
}

xt.ui.MainUI = MainUI;