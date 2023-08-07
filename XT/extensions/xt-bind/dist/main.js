"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
async function getNodeTree(uuid) {
    let data = [];
    let node = await Editor.Message.request('scene', 'query-node', uuid);
    if (node) {
        data.push(node);
        for (let child of node.children) {
            let childData = await getNodeTree(child.value.uuid);
            data = data.concat(childData);
        }
    }
    return data;
}
let excludeType = ['cc.Script', 'Number', 'String'];
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    async bind() {
        var _a;
        let uuid = Editor.Selection.getLastSelected('node');
        if (!uuid) {
            console.warn('未选中节点');
            return;
        }
        let node = await Editor.Message.request('scene', 'query-node', uuid);
        let nodeTree = await getNodeTree(uuid);
        // console.log(nodeTree);
        let selectComps = [];
        for (let comp of node.__comps__) {
            if (comp.cid == comp.type) {
                continue;
            }
            selectComps.push(comp);
        }
        for (let i = 0; i < selectComps.length; i++) {
            let comp = selectComps[i];
            for (let key in comp.value) {
                let valueData = comp.value[key];
                let displayName = valueData === null || valueData === void 0 ? void 0 : valueData.displayName;
                if (displayName != '' && displayName != null && displayName.startsWith('@')
                    && valueData.type != 'cc.Script'
                    && ((_a = valueData.value) === null || _a === void 0 ? void 0 : _a.uuid) != null) {
                    let resUuid;
                    let bindName = displayName.replace('@', '');
                    for (let n of nodeTree) {
                        if (n.name.value == bindName) {
                            if (valueData.type == 'cc.Node') {
                                resUuid = n.uuid.value;
                                break;
                            }
                            else {
                                let find = false;
                                for (let c of n.__comps__) {
                                    if (c.cid == valueData.type) {
                                        resUuid = c.value.uuid.value;
                                        find = true;
                                        break;
                                    }
                                }
                                if (find) {
                                    break;
                                }
                            }
                        }
                    }
                    if (!resUuid) {
                        console.warn(`未找到 name:${bindName} type:${valueData.type} 的绑定节点`);
                        return;
                    }
                    let res = await Editor.Message.request('scene', 'set-property', {
                        uuid: uuid,
                        path: `__comps__.${node.__comps__.indexOf(comp)}.${key}`,
                        dump: {
                            type: valueData.type,
                            value: {
                                uuid: resUuid
                            }
                        }
                    });
                    if (res) {
                        console.log(`${key}绑定成功`);
                    }
                    else {
                        console.warn(`${key}绑定失败`);
                    }
                }
            }
        }
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() { }
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
