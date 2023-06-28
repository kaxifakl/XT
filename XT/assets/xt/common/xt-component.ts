import { _decorator, Button, Component, EventHandler, instantiate, isValid, js, Node, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('XTComponent')
export class XTComponent extends Component {
    public static __$prefabUrl: string = null;
    public static __$bundle: string = null;

    /**加载器Key */
    public loaderKey: string = null;

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
    public createComponentNode<T extends XTComponent>(clazz: xt.Constructor<T> | string, callBack: (comp: T) => void, options?: xt.ComponentCreateOptions): void {
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
            let uiNode = instantiate(prefab);
            let comp = uiNode.getComponent(cls);
            if (!comp) {
                xt.error('预制体未绑定脚本', prefabUrl, className);
                return;
            }
            comp.loaderKey = options?.loaderKey || className;
            callBack && callBack(comp);
            //@ts-ignore
        }, cls.__$bundle)
    }

    public removeAllListener() {
        xt.eventManager.offByTarget(this);
    }

    public loadSpriteFrame(sprite: Sprite, spriteFrameUrl: string, bundle?: string): void {
        let loader = xt.loaderManager.getLoader(this.loaderKey);
        loader.load(spriteFrameUrl, SpriteFrame, (asset: SpriteFrame) => {
            if (isValid(sprite, true)) {
                sprite.spriteFrame = asset;
            }
        }, bundle);
    }

    protected onDestroy(): void {
        if (this.loaderKey) {
            xt.loaderManager.releaseLoader(this.loaderKey);
            this.loaderKey = null;
        }
        super.onDestroy();
    }
}

declare global {
    interface IXT {
        XTComponent: typeof XTComponent
    }
    namespace xt {
        type XTComponent = InstanceType<typeof XTComponent>
        interface ComponentCreateOptions {
            loaderKey?: string;
            prefabUrl?: string;
        }
    }
}

xt.XTComponent = xt.XTComponent || XTComponent