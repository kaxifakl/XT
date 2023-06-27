import { _decorator } from 'cc';
import { CommonUI } from './common-ui';
const { ccclass, property } = _decorator;
@ccclass('PopUI')
export class PopUI<T = any> extends CommonUI<T> {
}

declare global {
    interface IXT {
        PopUI: typeof PopUI
    }
    namespace xt {
        type PopUI = InstanceType<typeof PopUI>
    }
}

xt.PopUI = xt.PopUI || PopUI;