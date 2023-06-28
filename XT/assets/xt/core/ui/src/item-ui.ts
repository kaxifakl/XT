import { _decorator } from 'cc';
import { BaseUI } from './base-ui';
const { ccclass, property } = _decorator;
@ccclass('ItemUI')
export class ItemUI<T = any> extends BaseUI<T> {
    /**关闭Item
     * @param callBack 回调
     */
    public close(callBack?: any): void {
        this.onClose();
        this.removeAllListener();
        this.node.destroy();
        callBack && callBack();
    }
}

declare global {
    interface IUI {
        /**部件ItemUI基类 */
        ItemUI: typeof ItemUI
    }
    namespace xt.ui {
        type ItemUI = InstanceType<typeof ItemUI>
    }
}

xt.ui.ItemUI = xt.ui.ItemUI || ItemUI;