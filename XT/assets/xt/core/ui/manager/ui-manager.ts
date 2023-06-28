import { Node, find, js } from "cc";
import './ui-stack-container'

enum BuildinContainerType {
    /**栈容器 */
    Stack = 'Stack'
}

class UIManager {
    /**默认容器 */
    public DEFAULT_CONTAINER: BuildinContainerType = BuildinContainerType.Stack;
    public uiParentNode: Node = null;
    public uiMaskNode: Node = null;

    /**UI容器Map */
    private uiContainerMap: Map<string, xt.IUIContainer> = new Map();

    public init(param?: xt.IUIManagerParam): void {
        this.uiParentNode = param?.uiParentNode || find('Canvas/UI');
        this.uiMaskNode = param?.uiMaskNode || find("Canvas/UIMask");
        this.closeUIMask();
        let container = new xt.UIStackContainer()
        this.uiContainerMap.set(BuildinContainerType.Stack, container);
    }

    /**显示UI
     * @param clazz UI类或类字符串
     * @param param 传递的参数
     * @param options 参数
     * @returns 
     */
    public showUI<T extends xt.ui.BaseUI>(clazz: xt.Constructor<T> | string, param?: any, options?: xt.IUIOptions<T>): void {
        let containerType = options?.containerType || this.DEFAULT_CONTAINER;
        let container = this.uiContainerMap.get(containerType);
        if (container == null) {
            console.error(`没有找到该容器: ${containerType}`);
            return;
        }

        let cls: xt.Constructor<T>;
        if (typeof clazz === 'string') {
            cls = js.getClassByName(clazz) as xt.Constructor<T>;
        } else {
            cls = clazz as xt.Constructor<T>;
        }

        if (options == null) {
            options = {} as xt.IUIOptions<T>;
        }
        if (options.uiParentNode == null) {
            let superName = this.getSuperName(cls);
            options.superName = superName;
            options.uiParentNode = this.uiParentNode;
        }

        //@ts-ignore
        if (cls == null || cls.__$prefabUrl == null) {
            console.error('无法找到相关预制体:' + clazz);
            return;
        }

        xt.log('showUI', js.getClassName(clazz));
        container.showUI(cls, param, options);
    }

    /**关闭UI
     * @param clazz UI类或类字符串
     * @param options 参数
     * @returns 
     */
    public closeUI<T>(clazz: xt.Constructor<T> | string, containerType: string = null): void {
        containerType = containerType || this.DEFAULT_CONTAINER;
        let container = this.uiContainerMap.get(containerType);
        if (container == null) {
            console.error(`没有找到该容器: ${containerType}`);
            return;
        }

        let cls: xt.Constructor<T>;
        if (typeof clazz === 'string') {
            cls = js.getClassByName(clazz) as xt.Constructor<T>;
        } else {
            cls = clazz as xt.Constructor<T>;
        }

        //@ts-ignore
        if (cls == null) {
            console.error('无法找到相关类:' + clazz);
            return;
        }
        container.closeUI(cls);
    }

    /**关闭所有UI
     * @param containerType UI容器,默认为栈容器
     * @returns 
     */
    public closeAllUI(containerType: string = null): void {
        containerType = containerType || this.DEFAULT_CONTAINER;
        let container = this.uiContainerMap.get(containerType);
        if (container == null) {
            console.error(`没有找到该容器: ${containerType}`);
            return;
        }
        container.closeAllUI();
    }

    /**显示UIMask 界面（屏蔽全屏点击事件 ）*/
    public showUIMask(): void {
        if (!this.uiMaskNode) {
            xt.warn('UIMask没有初始化!')
            return;
        }
        this.uiMaskNode.active = true;
    }

    /**关闭UIMask 界面 */
    public closeUIMask(): void {
        if (!this.uiMaskNode) {
            xt.warn('UIMask没有初始化!')
            return;
        }
        this.uiMaskNode.active = false;
    }

    /**获取当前UI
     * @param containerType UI容器,默认为栈容器
     * @returns 
     */
    public getCurrentUI(containerType: string = null): xt.ui.BaseUI {
        containerType = containerType || this.DEFAULT_CONTAINER;
        let container = this.uiContainerMap.get(containerType);
        if (container == null) {
            console.error(`没有找到该容器: ${containerType}`);
            return;
        }
        container.getCurrentUI();
    }

    /**获取该类的基类名，用于区分WindowUI和PopUI */
    private getSuperName(cls: xt.Constructor<xt.ui.BaseUI>): string {
        let superCls = js.getSuper(cls);
        let superName = js.getClassName(superCls);
        let windowClsName = js.getClassName(xt.ui.WindowUI);
        let popClsName = js.getClassName(xt.ui.PopUI);
        while (superCls != null) {
            if (superName == windowClsName || superName == popClsName) {
                superCls = null;
            } else {
                superCls = js.getSuper(superCls);
                superName = js.getClassName(superCls);
            }
        }
        return superName;
    }
}

declare global {
    interface IXT {
        /**UI管理类 */
        uiManager: UIManager
    }
    namespace xt {
        interface IUIManagerParam {
            /**UI根节点 */
            uiParentNode?: Node;
            /**遮罩节点 */
            uiMaskNode?: Node;
        }
        interface IUIContainer {
            showUI<T extends xt.ui.BaseUI>(clazz: Constructor<T>, param: any, options: xt.IUIOptions<T>): void;
            closeUI<T>(clazz: Constructor<T>): void
            closeAllUI(): void;
            getCurrentUI(): xt.ui.BaseUI;
        }
        interface IUIOptions<T> {
            /**容器类型 */
            containerType?: BuildinContainerType;
            /**UI显示后回调
             * @param uiComp 显示的UI
             * @returns 
             */
            callBack?: (uiComp: T) => void;
            /**UI父节点,默认为UI根节点 */
            uiParentNode?: Node;
            /**预制体地址,默认由prefabUrl提供 */
            prefabUrl?: string;
            /**UI基类名,内部使用 */
            superName?: string
        }
    }
}

xt.uiManager = xt.uiManager || new UIManager;