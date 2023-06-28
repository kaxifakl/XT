import { _decorator, Component, js, Node } from 'cc';
import { XTComponent } from '../../../common/xt-component';
const { ccclass, property } = _decorator;

/**UI基类 */
@ccclass('BaseUI')
export class BaseUI<T = any> extends XTComponent {
    /**参数 */
    public param: T = null;

    /**当UI销毁时调用 */
    public onClose(): any {
    }

    /**UI关闭 */
    public close(callBack?: any): void {
        this.onClose();
        xt.uiManager.closeUI(js.getClassName(this));
        this.removeAllListener();
        callBack && callBack();
    }

    /**异步创建BaseUI,所有继承BaseUI的prefab通过此接口创建
     * @param clazz 类名或类
     * @param parentNode 父节点
     * @returns 
     */
    public createUI<Param = any, T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node): void;
    /**异步创建BaseUI,所有继承BaseUI的prefab通过此接口创建
     * @param clazz 类名或类
     * @param parentNode 父节点
     * @param callBack 回调
     * @returns 
     */
    public createUI<Param = any, T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, callBack: (uiComp: T) => void): void;
     /**异步创建BaseUI,所有继承BaseUI的prefab通过此接口创建
     * @param clazz 类名或类
     * @param parentNode 父节点
     * @param param 参数
     * @returns 
     */
    public createUI<Param = any, T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, param: Param): void;
     /**异步创建BaseUI,所有继承BaseUI的prefab通过此接口创建
     * @param clazz 类名或类
     * @param parentNode 父节点
     * @param param 参数
     * @param callBack 回调
     * @returns 
     */
    public createUI<Param = any, T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, param: Param, callBack: (uiComp: T) => void): void;
     /**异步创建BaseUI,所有继承BaseUI的prefab通过此接口创建
     * @param clazz 类名或类
     * @param parentNode 父节点
     * @param param 参数
     * @param callBack 回调
     * @returns 
     */
    public createUI<Param = any, T extends BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, param?: Param | ((uiComp: T) => void), callBack?: (uiComp: T) => void): void {
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

        this.createComponentNode(clazz, (comp: T) => {
            comp.param = _param;
            comp.node.parent = parentNode;
            _callback && _callback(comp);
        }, { loaderKey: this.loaderKey });
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
