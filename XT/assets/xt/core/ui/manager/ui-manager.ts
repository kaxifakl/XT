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

    /**显示UI */
    public showUI<Param = any, Options extends UIOptions = any>(clazz: xt.Constructor<xt.BaseUI> | string, param?: Param, options?: Options): void {
        let containerType = options?.containerType || this.DEFAULT_CONTAINER;
        let container = this.uiContainerMap.get(containerType);
        if (container == null) {
            console.error(`没有找到该容器: ${containerType}`);
            return;
        }

        let cls: xt.Constructor<xt.BaseUI>;
        if (typeof clazz === 'string') {
            cls = js.getClassByName(clazz) as xt.Constructor<xt.BaseUI>;
        } else {
            cls = clazz as xt.Constructor<xt.BaseUI>;
        }

        if (options == null) {
            options = {} as Options;
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

    public closeUI<Options extends UIOptions = any>(clazz: xt.Constructor<xt.BaseUI> | string, options?: Options): void {
        let containerType = options?.containerType || this.DEFAULT_CONTAINER;
        let container = this.uiContainerMap.get(containerType);
        if (container == null) {
            console.error(`没有找到该容器: ${containerType}`);
            return;
        }

        let cls: xt.Constructor<xt.BaseUI>;
        if (typeof clazz === 'string') {
            cls = js.getClassByName(clazz) as xt.Constructor<xt.BaseUI>;
        } else {
            cls = clazz as xt.Constructor<xt.BaseUI>;
        }

        //@ts-ignore
        if (cls == null) {
            console.error('无法找到相关类:' + clazz);
            return;
        }
        container.closeUI(cls);
    }

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

    /**获取当前UI */
    public getCurrentUI(containerType: string = null): xt.BaseUI {
        containerType = containerType || this.DEFAULT_CONTAINER;
        let container = this.uiContainerMap.get(containerType);
        if (container == null) {
            console.error(`没有找到该容器: ${containerType}`);
            return;
        }
        container.getCurrentUI();
    }

    private getSuperName(cls: xt.Constructor<xt.BaseUI>): string {
        let superCls = js.getSuper(cls);
        let superName = js.getClassName(superCls);
        let windowClsName = js.getClassName(xt.WindowUI);
        let popClsName = js.getClassName(xt.PopUI);
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
            uiParentNode?: Node;
            uiMaskNode?: Node;
        }
        interface IUIContainer {
            showUI<Param = any, Options extends UIOptions = any>(clazz: Constructor<xt.BaseUI>, param: Param, options: Options): void;
            closeUI(clazz: Constructor<xt.BaseUI>): void
            closeAllUI(): void;
            getCurrentUI(): xt.BaseUI;
        }
    }
    interface UIOptions {
        containerType?: string;
        callBack?: (uiComp: xt.BaseUI) => void;
        uiParentNode?: Node;
        prefabUrl?: string;
        superName?: string
    }
}

xt.uiManager = xt.uiManager || new UIManager;