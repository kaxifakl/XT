
import { _decorator } from 'cc';
import { CommonUI } from './common-ui';
const { ccclass, property } = _decorator;
@ccclass('WindowUI')
export class WindowUI<T = any> extends CommonUI<T> {
}

declare global {
    interface IUI {
        WindowUI: typeof WindowUI
    }
    namespace xt.ui {
        type WindowUI = InstanceType<typeof WindowUI>
    }
}

xt.ui.WindowUI = xt.ui.WindowUI || WindowUI;