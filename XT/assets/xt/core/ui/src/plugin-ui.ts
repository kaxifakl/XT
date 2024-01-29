import { _decorator } from 'cc';
import { CommonUI } from './common-ui';
const { ccclass, property } = _decorator;
@ccclass('PluginUI')
export class PluginUI<T = any> extends CommonUI<T> {
    
}

declare global {
    interface IUI {
        /**组件UI,用于多页签或面板 */
        PluginUI: typeof PluginUI
    }
    namespace xt.ui {
        type PluginUI = InstanceType<typeof PluginUI>
    }
}

xt.ui.PluginUI = xt.ui.PluginUI || PluginUI;