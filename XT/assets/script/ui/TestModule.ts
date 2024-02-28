import { _decorator, Component, Label, Node } from 'cc';
import { XTComponent } from '../../xt/common/xt-component';
import { QuickBind } from '../../xt/extern/x-bind/quick-bind';
const { ccclass, property } = _decorator;

@ccclass('TestModule')
export class TestModule extends XTComponent {
    @QuickBind('Label', Label)
    private testLabel: Label = null;

    start() {
        console.log(this.testLabel);
    }

    update(deltaTime: number) {

    }
}


