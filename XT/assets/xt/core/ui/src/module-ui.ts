import { _decorator } from 'cc';
import { BaseUI } from './base-ui';
const { ccclass, property } = _decorator;
@ccclass('ModuleUI')
export class ModuleUI<Param = any> extends BaseUI<Param> {
    /**UI关闭 */
    public close(callBack?: any): void {
        this.onClose();
        this.removeAllListener();
        this.node?.destroy();
        callBack && callBack();
    }
}

declare global {
    interface IUI {
        /**组件UI,用于多页签或面板 */
        ModuleUI: typeof ModuleUI
    }
    namespace xt.ui {
        type ModuleUI = InstanceType<typeof ModuleUI>
    }
}

xt.ui.ModuleUI = xt.ui.ModuleUI || ModuleUI;