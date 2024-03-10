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
        if (selectComps.length == 0) {
            console.warn('该节点没有快速绑定数据');
            return;
        }
        let resultArray = [];
        for (let i = 0; i < selectComps.length; i++) {
            let comp = selectComps[i];
            for (let key in comp.value) {
                //@ts-ignore
                let valueData = comp.value[key];
                let displayName = valueData === null || valueData === void 0 ? void 0 : valueData.displayName;
                if (displayName != '' && displayName != null && displayName.startsWith('🔗')
                    && valueData.type != 'cc.Script'
                    && ((_a = valueData.value) === null || _a === void 0 ? void 0 : _a.uuid) != null) {
                    let resUuid;
                    let sameNameCount = 0;
                    let bindName = displayName.replace('🔗', '');
                    for (let n of nodeTree) {
                        if (n.name.value == bindName) {
                            if (valueData.type == 'cc.Node') {
                                if (!resUuid) {
                                    resUuid = n.uuid.value;
                                }
                                else {
                                    sameNameCount++;
                                }
                                continue;
                            }
                            else {
                                for (let c of n.__comps__) {
                                    let tempCid = c.cid;
                                    let tempValue = c.value.uuid.value;
                                    if (!tempCid.includes('cc.')) {
                                        let compUUID = Editor.Utils.UUID.decompressUUID(tempCid);
                                        if (compUUID) {
                                            let compData = await Editor.Message.request('asset-db', 'query-asset-info', compUUID);
                                            if (compData) {
                                                tempCid = compData.name.replace('.ts', '');
                                                tempValue = tempCid;
                                            }
                                        }
                                    }
                                    if (tempCid == valueData.type) {
                                        if (!resUuid) {
                                            resUuid = tempValue;
                                        }
                                        else {
                                            sameNameCount++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (!resUuid) {
                        resultArray.push({ key: key, succ: false, warn: `未找到类型为${valueData.type}的绑定`, sameCount: 0 });
                        continue;
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
                    resultArray.push({ key: key, succ: !!res, warn: "property绑定失败", sameCount: sameNameCount });
                }
            }
        }
        console.log(`${node.name.value}绑定结果：\n`);
        for (let result of resultArray) {
            if (result.succ) {
                let outStr = "";
                outStr += `✔️${result.key}`;
                if (result.sameCount > 0) {
                    outStr += `\t(⚠️${result.sameCount}个同名节点)`;
                }
                console.log(outStr);
            }
            else {
                let outStr = "";
                outStr += `❌${result.key}`;
                outStr += `\t(${result.warn})`;
                console.log(outStr);
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
