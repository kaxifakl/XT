import { _decorator, Component, Label, Node } from 'cc';
import { QuickBind } from '../../xt/extern/x-bind/quick-bind';
import { ModuleUI } from '../../xt/core/ui/src/module-ui';
const { ccclass, property } = _decorator;

declare global {
    interface IUI { TestModule: typeof TestModule }
    namespace xt.ui { type TestModule = InstanceType<typeof TestModule> }
}

interface TestModuleParam {
    num: 1
}

@xt.decorator.setPrefab("prefab/TestModule")
@ccclass('TestModule')
export class TestModule<Param extends TestModuleParam = TestModuleParam> extends ModuleUI<TestModuleParam> {
    @QuickBind('Label', Label)
    private testLabel: Label = null;

    // updateView() {
    //     console.log(this.testLabel);
    //     console.log(this.param.num);
    // }

    start(): void {
        console.log(this.testLabel);
        console.log(this.param.num);
    }
}

xt.ui.TestModule = TestModule;
