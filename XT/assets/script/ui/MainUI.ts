import { _decorator, Component, Node } from 'cc';
import { WindowUI } from '../../xt/core/ui/src/window-ui';
const { ccclass, property } = _decorator;

@xt.prefabUrl('prefab/MainUI', 'game')
@ccclass('MainUI')
export class MainUI extends WindowUI {
    start() {

    }

    update(deltaTime: number) {

    }
}


