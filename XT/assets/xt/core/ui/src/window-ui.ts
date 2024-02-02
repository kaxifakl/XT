
import { _decorator } from 'cc';
import { BaseUI } from './base-ui';
const { ccclass, property } = _decorator;
@ccclass('WindowUI')
export class WindowUI<Param = any> extends BaseUI<Param> {
}

declare global {
    interface IUI {
        /**全屏页面基类 */
        WindowUI: typeof WindowUI
    }
    namespace xt.ui {
        type WindowUI = InstanceType<typeof WindowUI>
    }
}

xt.ui.WindowUI = xt.ui.WindowUI || WindowUI;