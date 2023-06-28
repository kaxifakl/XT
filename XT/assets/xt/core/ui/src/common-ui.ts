import { _decorator, Component, js, Node } from 'cc';
import { BaseUI } from './base-ui';
const { ccclass, property } = _decorator;

interface IPluginUIData {
    ui: xt.ui.BaseUI;
    parentNode: Node;
    param?: any;
    group?: string;
    state: boolean;
}

@ccclass('CommonUI')
export class CommonUI<T = any> extends BaseUI<T> {
    /**pluginUI的map */
    private pluginUIMap: Map<string, IPluginUIData> = null;

    /**添加pluginUI的参数信息,默认group为`common`
     * @param clazz UI类名或类字符串
     * @param parentNode 父节点
     * @param param 参数
     */
    public addPluginUI<T extends xt.ui.BaseUI, Param extends Object>(clazz: xt.Constructor<T> | string, parentNode: Node, param?: Param): void
    /**添加pluginUI的参数信息,默认group为`common` 
     * @param clazz UI类名或类字符串
     * @param parentNode 父节点
     * @param group 所属group
     */
    public addPluginUI<T extends xt.ui.BaseUI, Param extends Object>(clazz: xt.Constructor<T> | string, parentNode: Node, group?: string): void;
    /**添加pluginUI的参数信息,默认group为`common` 
     * @param clazz UI类名或类字符串
     * @param parentNode 父节点
     * @param param 参数
     * @param group 所属group
     */
    public addPluginUI<T extends xt.ui.BaseUI, Param extends Object>(clazz: xt.Constructor<T> | string, parentNode: Node, param?: Param | string, group?: string): void {
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

    /**显示一个pluginUI,会自动隐藏前一个同group的pluginUI
     * @param clazz UI类名或类字符串
     * @param param 参数
     */
    public showPluginUI<T extends xt.ui.BaseUI, Param extends Object>(clazz: xt.Constructor<T> | string, param?: Param): void;
    /**显示一个pluginUI,会自动隐藏前一个同group的pluginUI
     * @param clazz UI类名或类字符串
     * @param callBack 回调
     */
    public showPluginUI<T extends xt.ui.BaseUI, Param extends Object>(clazz: xt.Constructor<T> | string, callBack?: (uiComp: T) => void): void;
    /**显示一个pluginUI,会自动隐藏前一个同group的pluginUI
     * @param clazz UI类名或类字符串
     * @param param 参数
     * @param callBack 回调
     * @returns 
     */
    public showPluginUI<T extends xt.ui.BaseUI, Param extends Object>(clazz: xt.Constructor<T> | string, param?: Param | ((uiComp: T) => void), callBack?: (uiComp: xt.ui.BaseUI) => void): void {

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
            this.createUI(clazz, pluginUIData.parentNode, _param || pluginUIData.param, (uiComp: xt.ui.BaseUI) => {
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

    /**关闭一个pluginUI,只是隐藏,不会销毁
     * @param clazz UI类名或类字符串
     * @returns 
     */
    public hidePluginUI(clazz?: xt.Constructor<xt.ui.BaseUI> | string) {
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
    interface IUI {
        /**可添加PluginUI的通用UI基类 */
        CommonUI: typeof CommonUI
    }
    namespace xt.ui {
        type CommonUI = InstanceType<typeof CommonUI>
    }
}

xt.ui.CommonUI = xt.ui.CommonUI || CommonUI;