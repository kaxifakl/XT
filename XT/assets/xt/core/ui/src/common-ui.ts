import { _decorator, Component, js, Node } from 'cc';
import { BaseUI } from './base-ui';
const { ccclass, property } = _decorator;

interface IPluginUIData {
    ui: xt.BaseUI;
    parentNode: Node;
    param?: any;
    group?: string;
    state: boolean;
}

@ccclass('CommonUI')
export class CommonUI<T = any> extends BaseUI<T> {
    /**pluginUI的map */
    private pluginUIMap: Map<string, IPluginUIData> = null;

    /**添加pluginUI的参数信息,默认group为`common` */
    public addPluginUI<Param = any>(clazz: xt.Constructor<xt.BaseUI> | string, parentNode: Node, param?: Param): void
    public addPluginUI<Param = any>(clazz: xt.Constructor<xt.BaseUI> | string, parentNode: Node, group?: string): void;
    public addPluginUI<Param = any>(clazz: xt.Constructor<xt.BaseUI> | string, parentNode: Node, param?: Param | string, group?: string): void {
        let _param = null, _group = null;
        if (typeof param == 'string') {
            _param = null;
            _group = param;
        } else {
            _param = param;
            _group = group;
        }
        if (!_group) {
            _group = "common";
        }

        if (this.pluginUIMap == null) {
            this.pluginUIMap = new Map();
        }
        let className: string = null;
        if (typeof clazz === 'string') {
            className = clazz;
        } else {
            className = js.getClassName(clazz);
        }
        this.pluginUIMap.set(className, { ui: null, parentNode: parentNode, param: _param, group: _group, state: false });
    }

    /**显示一个pluginUI,会自动隐藏前一个 */
    public showPluginUI<Param = any>(clazz: xt.Constructor<xt.BaseUI> | string, param?: Param): void;
    public showPluginUI<Param = any>(clazz: xt.Constructor<xt.BaseUI> | string, callBack?: (uiComp: xt.BaseUI) => void): void;
    public showPluginUI<Param = any>(clazz: xt.Constructor<xt.BaseUI> | string, param?: Param | ((uiComp: xt.BaseUI) => void), callBack?: (uiComp: xt.BaseUI) => void): void {

        let _param = null, _callBack = null;
        if (typeof param === 'function') {
            _callBack = param;
        } else {
            _param = param;
            _callBack = callBack;
        }

        let className: string = null;
        if (typeof clazz === 'string') {
            className = clazz;
        } else {
            className = js.getClassName(clazz);
        }

        if (this.pluginUIMap == null) {
            console.error('使用前需要先addPluginUI的信息:', className);
            return;
        }

        let pluginUIData = this.pluginUIMap.get(className);
        if (pluginUIData == null) {
            console.error('使用前需要先addPluginUI的信息:', className);
            return;
        }

        if (pluginUIData.ui != null) {
            //关闭相同group的pluginUI
            if (pluginUIData.group != null) {
                this.pluginUIMap.forEach((data, key) => {
                    if (key != className && data.group != null && data.group == pluginUIData.group) {
                        if (data.ui) {
                            data.ui.node.active = false;
                        }
                        data.state = false;
                    }
                })
            }

            pluginUIData.ui.param = _param || pluginUIData.param;
            pluginUIData.state = true;
            pluginUIData.ui.node.active = true;
            _callBack && _callBack(pluginUIData.ui);
        } else {
            xt.uiManager.showUIMask();
            this.createUI(clazz, pluginUIData.parentNode, _param || pluginUIData.param, (uiComp: xt.BaseUI) => {
                xt.uiManager.closeUIMask();
                //关闭相同group的pluginUI
                if (pluginUIData.group != null) {
                    this.pluginUIMap.forEach((data, key) => {
                        if (data.group != null && data.group == pluginUIData.group && data.ui) {
                            data.ui.node.active = false;
                            data.state = false;
                        }
                    })
                }
                pluginUIData.ui = uiComp;
                pluginUIData.state = true;
                _callBack && _callBack(uiComp);
            });
        }
    }

    /**关闭一个pluginUI,只是隐藏,不会销毁 */
    public hidePluginUI(clazz?: xt.Constructor<xt.BaseUI> | string) {
        if (this.pluginUIMap == null) {
            return;
        }

        if (!clazz) {
            this.pluginUIMap.forEach((data, key) => {
                data.ui.node.active = false;
                data.state = false;
            })
            return;
        }

        let className: string = null;
        if (typeof clazz === 'string') {
            className = clazz;
        } else {
            className = js.getClassName(clazz);
        }

        let pluginUIData = this.pluginUIMap.get(className);
        if (pluginUIData) {
            if (pluginUIData.ui) {
                pluginUIData.ui.node.active = false;
                pluginUIData.state = false;
            }
        }
    }

    /**UI销毁前销毁pluginUI */
    private destroyPluginUI(): void {
        if (this.pluginUIMap == null) {
            return;
        }
        this.pluginUIMap.forEach((data, key: string) => {
            if (data.ui) {
                data.ui.onClose();
                data.ui.removeAllListener();
                data.ui.destroy();
            }
        })
        this.pluginUIMap = null;
    }

    /**UI关闭 */
    public close(callBack?: any): void {
        this.destroyPluginUI();
        super.close(callBack)
    }
}

declare global {
    interface IXT {
        CommonUI: typeof CommonUI
    }
    namespace xt {
        type CommonUI = InstanceType<typeof CommonUI>
    }
}

xt.CommonUI = xt.CommonUI || CommonUI;