
import { _decorator } from 'cc';
import { CommonUI } from './common-ui';
const { ccclass, property } = _decorator;
@ccclass('WindowUI')
export class WindowUI<T = any> extends CommonUI<T> {
}

declare global {
    interface IXT {
        WindowUI: typeof WindowUI
    }
    namespace xt {
        type WindowUI = InstanceType<typeof WindowUI>
    }
}

xt.WindowUI = xt.WindowUI || WindowUI;