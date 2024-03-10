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
        this.updateView()

        this.createSyncModule(xt.ui.TestModule, this.node, { num: 1 }, (module) => {
            module.node.setPosition(200, 0)
        });
    }
}

xt.ui.MainUI = MainUI;