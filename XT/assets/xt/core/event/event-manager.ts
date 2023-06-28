import { isValid } from "cc";

type EventHandlerMap = Map<string, Map<xt.HandlerType, TriggerData>>;

interface TriggerData {
    handler: xt.HandlerType;
    once: boolean;
}

class EventManager {

    private eventTargetSetMap: Map<string, Set<Object>> = new Map();
    private eventHandlerMapMap: Map<Object, EventHandlerMap> = new Map();

    public on(key: string, handler: xt.HandlerType, target: Object): void {
        this._on(key, handler, target, false);
    }

    public once(key: string, handler: xt.HandlerType, target: Object): void {
        this._on(key, handler, target, true);
    }

    private _on(key: string, handler: xt.HandlerType, target: Object, once: boolean): void {
        let eventHandlerMap = this.eventHandlerMapMap.get(target);
        if (!eventHandlerMap) {
            eventHandlerMap = new Map<string, Map<xt.HandlerType, TriggerData>>();
            this.eventHandlerMapMap.set(target, eventHandlerMap);
        }

        let handlerMap = eventHandlerMap.get(key);
        if (!handlerMap) {
            handlerMap = new Map<xt.HandlerType, TriggerData>();
            eventHandlerMap.set(key, handlerMap)
        }

        let triggerData = handlerMap.get(handler)
        if (!triggerData) {
            handlerMap.set(handler, { handler: handler, once: once });
        }

        let eventTargetSet = this.eventTargetSetMap.get(key);
        if (!eventTargetSet) {
            eventTargetSet = new Set();
            this.eventTargetSetMap.set(key, eventTargetSet);
        }

        eventTargetSet.add(target);
    }

    public off(key: string, handler: xt.HandlerType, target: Object): void {
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
        this.checkEmpty(key, target, handlerMap, eventHandlerMap);
    }

    public offByTarget(target: Object): void {
        let eventHandlerMap = this.eventHandlerMapMap.get(target);
        if (eventHandlerMap) {
            eventHandlerMap.forEach((handlerMap, key) => {
                let eventTargetSet = this.eventTargetSetMap.get(key);
                if (eventTargetSet) {
                    eventTargetSet.delete(target);
                    if (eventTargetSet.size === 0) {
                        this.eventTargetSetMap.delete(key);
                    }
                }
            })
            this.eventHandlerMapMap.delete(target);
        }
    }

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
        this.checkEmpty(key, target, handlerMap, eventHandlerMap);
    }

    private checkEmpty(key: string, target: Object, handlerMap: Map<xt.HandlerType, TriggerData>, eventHandlerMap: EventHandlerMap): void {
        if (handlerMap.size === 0) {
            eventHandlerMap.delete(key);
            if (eventHandlerMap.size === 0) {
                this.eventHandlerMapMap.delete(target);
            }
        }
    }

}

declare global {
    interface IXT {
        eventManager: EventManager
    }
    namespace xt {
        type EventManager = InstanceType<typeof EventManager>
    }
}

export { }

xt.eventManager = xt.eventManager || new EventManager();