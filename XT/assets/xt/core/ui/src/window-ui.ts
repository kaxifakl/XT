
import { _decorator } from 'cc';
import { BaseUI } from './base-ui';
import { BaseUIType } from './ui-type';
const { ccclass, property } = _decorator;
@ccclass('WindowUI')
export class WindowUI<Param = any> extends BaseUI<Param> {
    public uiType: BaseUIType = BaseUIType.WindowUI;

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