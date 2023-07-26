import '../log/log'
import { Node, isValid } from 'cc';

class RedPoint {
    public key: string | number = null;
    public state: boolean = false;
    public parentKey: string | number = null;
    public childrenKey: (string | number)[] = null;
    public node: Set<Node> = null;
    public updateCall: (...args: any[]) => boolean = null;
}

class RedPointManager {
    /**所有红点Map */
    public pointMap: Map<string | number, RedPoint> = new Map();

    /**增加一个红点
     * @param key 红点key
     * @param parentKey 父红点key
     * @param updateCall 刷新方法
     * @returns 
     */
    public addPoint(key: string | number, parentKey?: string | number, updateCall?: (...args: any[]) => boolean): void {
        if (this.pointMap.has(key)) {
            xt.warn('已经存在该红点：', key)
            return;
        }
        let point = new RedPoint();
        point.key = key;
        point.parentKey = parentKey;
        point.updateCall = updateCall;
        this.pointMap.set(key, point);
        if (!parentKey) {
            return;
        }
        let parent = this.pointMap.get(parentKey);
        if (!parent) {
            xt.warn('未找到父红点：', parentKey)
            return;
        }
        if (!parent.childrenKey) {
            parent.childrenKey = [];
        }
        parent.childrenKey.push(key);
        return;
    }

    /**节点与红点绑定
     * @param key 红点key
     * @param node 节点
     * @returns 
     */
    public bindNode(key: string | number, node: Node | Node[]): void {
        let point = this.pointMap.get(key);
        if (!point) {
            xt.warn('未找到该红点：', key)
            return;
        }
        if (!point.node) {
            point.node = new Set();
        }
        if (Array.isArray(node)) {
            for (let temp of node) {
                point.node.add(temp);
                if (isValid(temp, true)) {
                    temp.active = point.state;
                }
            }
        } else {
            point.node.add(node);
            if (isValid(node, true)) {
                node.active = point.state;
            }
        }
    }

    /**解绑红点的节点
     * @param key 红点key
     * @returns 
     */
    public unbindNode(key: string | number): void {
        let point = this.pointMap.get(key);
        if (!point) {
            xt.warn('未找到该红点：', key)
            return;
        }
        if (point.node) {
            point.node.clear();
        }
    }

    /**解绑红点的节点以及所有子红点的节点
     * @param key 红点key
     * @returns 
     */
    public unbindNodeAndChildrenNode(key: string | number): void {
        let point = this.pointMap.get(key);
        if (!point) {
            xt.warn('未找到该红点：', key)
            return;
        }
        if (point.node) {
            point.node.clear();
        }
        if (point.childrenKey && point.childrenKey.length > 0) {
            point.childrenKey.forEach(key => {
                this.unbindNodeAndChildrenNode(key);
            });
        }
    }

    /**改变红点状态
     * @param key 红点key
     * @param state 红点状态
     * @returns 
     */
    public changeState(key: string | number, state: boolean): void {
        let point = this.pointMap.get(key);
        if (!point) {
            xt.warn('未找到该红点：', key)
            return;
        }
        if (point.state == state) {
            return;
        }
        
        point.state = state;
        if (point.node && point.node.size > 0) {
            for (let temp of point.node) {
                if (isValid(temp, true)) {
                    temp.active = state;
                }
            }
        }
        while (point.parentKey) {
            let parent = this.pointMap.get(point.parentKey);
            if (parent) {
                let tempLastState = parent.state;
                if (parent.childrenKey) {
                    parent.childrenKey.forEach(key => {
                        let tempPoint = this.pointMap.get(key);
                        if (tempPoint && tempPoint.state) {
                            parent.state = tempPoint.state;
                            return;
                        }
                    })
                    if (parent.state != tempLastState) {
                        if (parent.node && parent.node.size > 0) {
                            for (let temp of parent.node) {
                                if (isValid(temp, true)) {
                                    temp.active = parent.state;
                                }
                            }
                        }
                    }
                }
            }
            point = parent;
        }
    }

    /**刷新红点
     * @param key 红点key
     * @param args 参数
     * @returns 
     */
    public updatePoint(key: string | number, ...args: any[]): void {
        let point = this.pointMap.get(key);
        if (!point) {
            xt.warn('未找到该红点：', key)
            return;
        }
        if (!point.updateCall) {
            xt.warn('该红点不存在刷新方法：', key)
            return;
        }
        let lastState = point.state;
        point.state = !!point.updateCall(...args);
        if (point.state != lastState) {
            this.changeState(point.key, point.state);
        }
    }

    /**删除红点,并删除其下所有子红点
     * @param key 
     * @returns 
     */
    public deletePoint(key: string | number) {
        let point = this.pointMap.get(key);
        if (!point) {
            xt.warn('未找到该红点：', key)
            return;
        }
        this.pointMap.delete(key);
        if (point.childrenKey && point.childrenKey.length > 0) {
            point.childrenKey.forEach(key => {
                this.deletePoint(key);
            });
        }
    }

}

declare global {
    interface IXT {
        /**红点管理类 */
        redPointManager: RedPointManager
    }
}

export { }

xt.redPointManager = xt.redPointManager || new RedPointManager();