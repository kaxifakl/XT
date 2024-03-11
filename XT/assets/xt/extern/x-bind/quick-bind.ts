import { __private, _decorator, Node } from 'cc';
const { property } = _decorator;

export function QuickBind(nodeName: string, type?: __private._types_globals__Constructor) {
    return property({ displayName: '🔗' + nodeName, type: type || Node })
}