import { Node, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SyncModule')
export class SyncModule<T> {
    private clazz: xt.Constructor<T> | string = null;
    private param: any = null;
    private callBack?: (uiComp: T) => void = null;
    private module: xt.ui.BaseUI = null;
    private init: boolean = false;

    loadModule<Param = any, T extends xt.ui.BaseUI = any>(clazz: xt.Constructor<T> | string, parentNode: Node, loaderKey: string, param?: Param, callBack?: (uiComp: T) => void) {
        if (this.init) {
            xt.warn('该异步模块已加载', this);
            return;
        }
        this.init = true;
        this.clazz = clazz as any;
        this.param = param;
        this.callBack = callBack as any;
        xt.XTComponent.createComponentNode(clazz, (comp: T) => {
            this.module = comp;
            comp.param = this.param;
            comp.node.parent = parentNode;
            if (this.callBack) {
                this.callBack(comp as any);
            }
        }, { loaderKey: loaderKey, parentNode: parentNode });
    }

    updateView(param: any): void {
        this.param = param;
        if (this.module) {
            this.module.param = param;
            this.module.updateView(this.param);
        }
    }
}

declare global {
    interface IUI {
        SyncModule: typeof SyncModule
    }
    namespace xt.ui {
        type SyncModule = InstanceType<typeof SyncModule>
    }
}

export { }

xt.ui.SyncModule = xt.ui.SyncModule || SyncModule