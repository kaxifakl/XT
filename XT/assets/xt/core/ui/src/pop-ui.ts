import { _decorator } from 'cc';
import { CommonUI } from './common-ui';
const { ccclass, property } = _decorator;
@ccclass('PopUI')
export class PopUI<T = any> extends CommonUI<T> {
}

declare global {
    interface IUI {
        /**弹窗基类 */
        PopUI: typeof PopUI
    }
    namespace xt.ui {
        type PopUI = InstanceType<typeof PopUI>
    }
}

xt.ui.PopUI = xt.ui.PopUI || PopUI;