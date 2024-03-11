import { isValid } from "cc";

/**存放target下事件key对应的事件数据 */
type EventHandlerMap = Map<string, Map<xt.EventHandler, TriggerData>>;

interface TriggerData {
    /**回调 */
    handler: xt.EventHandler;
    /**是否单次监听 */
    once: boolean;
}

class EventManager {

    /**存放事件key对应触发的target */
    private eventTargetSetMap: Map<string, Set<Object>> = new Map();
    /**存放target对应的所有事件数据 */
    private eventHandlerMapMap: Map<Object, EventHandlerMap> = new Map();

    /**监听事件
     * @param key 事件key
     * @param handler 回调
     * @param target 回调指向的target
     */
    public on(key: string, handler: xt.EventHandler, target: Object): void {
        this._on(key, handler, target, false);
    }

    /**单次监听事件,事件触发后会自动取消监听
     * @param key 事件key
     * @param handler 回调
     * @param target 回调指向的target
     */
    public once(key: string, handler: xt.EventHandler, target: Object): void {
        this._on(key, handler, target, true);
    }

    private _on(key: string, handler: xt.EventHandler, target: Object, once: boolean): void {
        let eventHandlerMap = this.eventHandlerMapMap.get(target);
        if (!eventHandlerMap) {
            eventHandlerMap = new Map<string, Map<xt.EventHandler, TriggerData>>();
            this.eventHandlerMapMap.set(target, eventHandlerMap);
        }

        let handlerMap = eventHandlerMap.get(key);
        if (!handlerMap) {
            handlerMap = new Map<xt.EventHandler, TriggerData>();
            eventHandlerMap.set(key, handlerMap)
        }

        let triggerData = handlerMap.get(handler)
        if (!triggerData) {
            handlerMap.set(handler, { handler: handler, once: once });
        } else {
            console.warn('该事件重复注册,已忽略:', key, handler, target, once);
        }

        let eventTargetSet = this.eventTargetSetMap.get(key);
        if (!eventTargetSet) {
            eventTargetSet = new Set();
            this.eventTargetSetMap.set(key, eventTargetSet);
        }

        eventTargetSet.add(target);
    }

    /**取消事件监听
     * @param key 事件key
     * @param handler 回调
     * @param target 回调指向的target
     * @returns 
     */
    public off(key: string, handler: xt.EventHandler, target: Object): void {
        let eventHandlerMap = this.eventHandlerMapMap.get(target);
        if (!eventHandlerMap) {
            return;
        }
        let handlerMap = eventHandlerMap.get(key);
        if (!handlerMap) {
            return;
        }
        let triggerData = handlerMap.get(handler);
        if (!triggerData) {
            return;
        }
        handlerMap.delete(handler);
        if (handlerMap.size == 0) {
            this.deleteEventHandlerMap(key, target, eventHandlerMap);
            this.deleteTargetInEventTargetSet(key, target);
        }
    }

    /**取消target上所有事件
     * @param target 回调指向的target
     */
    public offByTarget(target: Object): void {
        let eventHandlerMap = this.eventHandlerMapMap.get(target);
        if (eventHandlerMap) {
            eventHandlerMap.forEach((handlerMap, key) => {
                this.deleteTargetInEventTargetSet(key, target);
            })
            this.eventHandlerMapMap.delete(target);
        }
    }

    public offByTargetAndKey(target: Object, key: string): void {
        let eventHandlerMap = this.eventHandlerMapMap.get(target);
        if (eventHandlerMap) {
            this.deleteEventHandlerMap(key, target, eventHandlerMap);
        }
        this.deleteTargetInEventTargetSet(key, target);
    }

    /**派发事件
     * @param key 事件key
     * @param args 事件参数
     */
    public emit(key: string, ...args: any[]): void {
        let eventTargetSet = this.eventTargetSetMap.get(key)
        if (eventTargetSet) {
            eventTargetSet.forEach((target) => {
                if (isValid(target, true)) {
                    this.triggerTarget(key, target, ...args)
                } else {
                    this.offByTarget(target);
                }
            })
        }
    }

    /**给指定target派发事件
     * @param key 事件key
     * @param target 回调指向的target
     * @param args 事件参数
     */
    public emitToTarget(key: string, target: Object, ...args: any[]): void {
        this.triggerTarget(key, target, ...args)
    }

    private triggerTarget(key: string, target: Object, ...args: any[]): void {
        let eventHandlerMap = this.eventHandlerMapMap.get(target);
        if (!eventHandlerMap) {
            return;
        }

        let handlerMap = eventHandlerMap.get(key);
        if (!handlerMap) {
            return;
        }
        handlerMap.forEach((triggerData, handlerType) => {
            triggerData.handler.call(target, ...args);
            if (triggerData.once) {
                handlerMap.delete(handlerType);
            }
        })
        if (handlerMap.size === 0) {
            this.deleteEventHandlerMap(key, target, eventHandlerMap);
            this.deleteTargetInEventTargetSet(key, target);
        }
    }

    private deleteEventHandlerMap(key: string, target: Object, eventHandlerMap: EventHandlerMap): void {
        eventHandlerMap.delete(key);
        if (eventHandlerMap.size === 0) {
            this.eventHandlerMapMap.delete(target);
        }
    }

    private deleteTargetInEventTargetSet(key: string, target: Object): void {
        let eventTargetSet = this.eventTargetSetMap.get(key);
        if (eventTargetSet) {
            eventTargetSet.delete(target);
            if (eventTargetSet.size === 0) {
                this.eventTargetSetMap.delete(key);
            }
        }
    }

}

declare global {
    interface IXT {
        /**全局事件管理类 */
        eventManager: EventManager
    }
    namespace xt {
        type EventManager = InstanceType<typeof EventManager>
    }
}

export { }

xt.eventManager = xt.eventManager || new EventManager();