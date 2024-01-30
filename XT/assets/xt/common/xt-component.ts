import { _decorator, Button, Component, EventHandler, instantiate, isValid, js, Node, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**XT组件基类 */
@ccclass('XTComponent')
export class XTComponent extends Component {
    private static __$prefabUrl: string = null;
    private static __$bundle: string = null;

    private _loaderKey: string = null;
    /**原始loaderKey,无需递归寻找 */
    public get rawLoaderKey(): string {
        return this._loaderKey;
    }
    /**加载器Key */
    public get loaderKey(): string {
        if (this._loaderKey) {
            return this._loaderKey;
        }
        this.findLoaderKeyFromParent();
        return this._loaderKey;
    }
    public set loaderKey(value: string) {
        this._loaderKey = value;
    }

    /**从父节点上寻找loaderKey */
    private findLoaderKeyFromParent(): void {
        let parent = this.node.parent
        while (parent) {
            let comp = this.node.parent.getComponent(XTComponent);
            if (comp && comp.loaderKey) {
                this._loaderKey = comp.loaderKey;
                break;
            } else {
                parent = parent.parent;
            }
        }
    }

    /**注册按钮点击事件
     * @param button 按钮组件
     * @param clickCall 点击回调
     * @param target 回调指向的target,默认为this
     */
    public registerBtnClickEvent(button: Button, clickCall: any, target?: any): void {
        target = target || this;
        let handler = new EventHandler();
        handler.handler = clickCall;
        handler.emit = (params: any[]) => {
            if (isValid(this, true) && typeof handler.handler == 'function') {
                (handler.handler as Function).call(target, ...params);
            }
        }
        button.clickEvents.push(handler)
    }

    /**注销按钮点击事件
     * @param button 按钮组件
     * @param clickCall 点击回调
     */
    public unregisterBtnClickEvent(button: Button, clickCall: any): void {
        let events = button.clickEvents
        for (let i = events.length - 1; i >= 0; i--) {
            if (events[i].handler == clickCall) {
                events.splice(i, 1);
            }
        }
    }

    /**创建组件节点
     * @param clazz 类或string
     * @param callBack 回调
     * @param options 加载参数
     * @returns 
     */
    public createComponentNode<T extends XTComponent>(clazz: xt.Constructor<T> | string, callBack: (comp: T) => void, options: xt.ComponentCreateOptions): void {
        let cls: xt.Constructor<T>;
        if (typeof clazz === 'string') {
            cls = js.getClassByName(clazz) as xt.Constructor<T>;
        } else {
            cls = clazz as xt.Constructor<T>;
        }

        //@ts-ignore
        let prefabUrl = options?.prefabUrl || cls.__$prefabUrl;

        if (cls == null || prefabUrl == null) {
            console.error('无法找到相关预制体:' + clazz);
            return;
        }

        let className = js.getClassName(cls);
        let loader = xt.loaderManager.getLoader(options?.loaderKey || className);
        loader.load(prefabUrl, Prefab, (prefab: Prefab) => {
            if (!isValid(options.parentNode, true)) {
                return;
            }
            let uiNode = instantiate(prefab);
            let comp = uiNode.getComponent(cls);
            if (!comp) {
                xt.error('预制体未绑定脚本', prefabUrl, className);
                return;
            }
            comp.loaderKey = options?.loaderKey;
            callBack && callBack(comp);
            //@ts-ignore
        }, cls.__$bundle)
    }

    /**移除当前组件所有全局事件 */
    public removeAllListener() {
        xt.eventManager.offByTarget(this);
    }

    /**动态加载spriteFrame
     * @param sprite Sprite组件
     * @param spriteFrameUrl spriteFrame地址
     * @param bundle AssetBundle名
     */
    public loadSpriteFrame(sprite: Sprite, spriteFrameUrl: string, bundle?: string): void {
        let loader = xt.loaderManager.getLoader(this.loaderKey);
        loader.load(spriteFrameUrl, SpriteFrame, (asset: SpriteFrame) => {
            if (isValid(sprite, true)) {
                sprite.spriteFrame = asset;
            }
        }, bundle);
    }
}

declare global {
    interface IXT {
        /**XT组件基类 */
        XTComponent: typeof XTComponent
    }
    namespace xt {
        type XTComponent = InstanceType<typeof XTComponent>
        /**组件创建参数 */
        interface ComponentCreateOptions {
            /**加载器key */
            loaderKey?: string;
            /**预制体地址 */
            prefabUrl?: string;
            /**父节点地址 */
            parentNode: Node;
        }
    }
}

xt.XTComponent = xt.XTComponent || XTComponent