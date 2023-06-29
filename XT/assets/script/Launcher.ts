import { _decorator, Component, Node, Prefab, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Launcher')
export class Launcher extends Component {
    onLoad() {
        xt.init();
        xt.uiManager.init();

        xt.config.DEFAULT_BUNDLE = 'game';
        xt.util.loadBundles('game', () => {
            xt.uiManager.showUI(xt.ui.MainUI, null, {
                callBack: (ui: xt.ui.MainUI) => {

                }
            })
        })
    }
}


