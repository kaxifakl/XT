import { _decorator } from 'cc';
import { BaseUI } from './base-ui';
const { ccclass, property } = _decorator;
@ccclass('ItemUI')
export class ItemUI<T = any> extends BaseUI<T> {

    public close(callBack?: any): void {
        this.onClose();
        this.removeAllListener();
        this.node.destroy();
        callBack && callBack();
    }
}

declare global {
    interface IXT {
        ItemUI: typeof ItemUI
    }
    namespace xt {
        type ItemUI = InstanceType<typeof ItemUI>
    }
}

xt.ItemUI = xt.ItemUI || ItemUI;