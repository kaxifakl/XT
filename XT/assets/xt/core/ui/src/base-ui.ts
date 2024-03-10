import { _decorator, Component, isValid, js, Node } from 'cc';
import { XTComponent } from '../../../common/xt-component';
import { SyncModule } from './sync-module';
import { BaseUIType } from './ui-type';
const { ccclass, property } = _decorator;

/**UI基类 */
@ccclass('BaseUI')
export class BaseUI<Param = any> extends XTComponent {
    /**UI类型 */
    public uiType: BaseUIType = null;
    /**参数 */
    public param: Param = {} as any;
    /**重写ui-manager中销毁ui的方式 */
    public overrideDestroy: () => void = null;

    public updateView(param?: Param): void {

    }

    /**当UI销毁时调用 */
    public onClose(): any {
    }

    public createSyncModule<T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node): SyncModule<T>;
    public createSyncModule<T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, callBack: (module: T) => void): SyncModule<T>;
    public createSyncModule<T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, param: T['param']): SyncModule<T>;
    public createSyncModule<T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, param: T['param'], callBack: (module: T) => void): SyncModule<T>;
    public createSyncModule<T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, param?: T['param'] | ((module: T) => void), callBack?: (module: T) => void): SyncModule<T> {
        let _param = null;
        let _callback = null;
        if (typeof callBack === 'function') {
            _param = param;
            _callback = callBack;
        } else {
            if (typeof param === 'function') {
                _callback = param;
            } else {
                _param = param;
            }
        }
        let module = new SyncModule<T>();
        module.loadModule(clazz, parentNode, this.loaderKey, _param, _callback);
        return module;
    }

    /**UI关闭 */
    public close(callBack?: any): void {
        this.onClose();
        this.removeAllListener();
        xt.uiManager.closeUI(this.className || js.getClassName(this));
        callBack && callBack();
    }

}

declare global {
    interface IUI {
        /**UI基类 */
        BaseUI: typeof BaseUI
    }
    namespace xt.ui {
        type BaseUI = InstanceType<typeof BaseUI>
    }
}

xt.ui.BaseUI = xt.ui.BaseUI || BaseUI;
