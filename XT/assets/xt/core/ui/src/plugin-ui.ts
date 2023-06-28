import { _decorator } from 'cc';
import { CommonUI } from './common-ui';
const { ccclass, property } = _decorator;
@ccclass('PluginUI')
export class PluginUI<T = any> extends CommonUI<T> {
    public close(callBack?: any): void {
        console.error('PluginUI会随主UI自动销毁,无需手动调用');
    }
}

declare global {
    interface IUI {
        PluginUI: typeof PluginUI
    }
    namespace xt.ui {
        type PluginUI = InstanceType<typeof PluginUI>
    }
}

xt.ui.PluginUI = xt.ui.PluginUI || PluginUI;