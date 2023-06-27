import { _decorator, Component, Node, Prefab, SpriteFrame } from 'cc';
import { MainUI } from './ui/MainUI';
const { ccclass, property } = _decorator;

@ccclass('Launcher')
export class Launcher extends Component {
    start() {
        xt.init();
        xt.uiManager.init()
        xt.util.loadBundles('game', () => {
            xt.uiManager.showUI(MainUI)
        })
    }

    update(deltaTime: number) {

    }
}


