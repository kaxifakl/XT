import { __private, _decorator, Node } from 'cc';
const { property } = _decorator;

export function QuickBind(nodeName: string, type?: __private.__types_globals__Constructor) {
    return function (target: any, propertyKey: string) {
        let decorator = property({ displayName: `🔗${nodeName}(${propertyKey})`, type: type || Node, tooltip: `${nodeName}(${propertyKey})` })
        decorator(target, propertyKey)
    }
}