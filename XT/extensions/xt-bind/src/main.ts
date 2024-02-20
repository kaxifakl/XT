declare let Editor: any;

async function getNodeTree(uuid: string) {
    let data: any[] = [];
    let node = await Editor.Message.request('scene', 'query-node', uuid);
    if (node) {
        data.push(node)
        for (let child of node.children) {
            let childData = await getNodeTree(child.value.uuid)
            data = data.concat(childData);
        }
    }
    return data;
}

let excludeType = ['cc.Script', 'Number', 'String']

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    async bind() {
        let uuid = Editor.Selection.getLastSelected('node')
        if (!uuid) {
            console.warn('未选中节点')
            return;
        }
        let node = await Editor.Message.request('scene', 'query-node', uuid)

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
            console.warn('该节点没有自定义组件');
            return;
        }

        let resultArray = [];

        for (let i = 0; i < selectComps.length; i++) {
            let comp = selectComps[i]
            for (let key in comp.value as any) {
                //@ts-ignore
                let valueData = comp.value[key]
                let displayName = valueData?.displayName
                if (displayName != '' && displayName != null && displayName.startsWith('🔗')
                    && valueData.type != 'cc.Script'
                    && valueData.value?.uuid != null) {
                    let resUuid;
                    let sameNameCount = 0;
                    let bindName = displayName.replace('🔗', '');
                    for (let n of nodeTree) {
                        if (n.name.value == bindName) {
                            if (valueData.type == 'cc.Node') {
                                if (!resUuid) {
                                    resUuid = n.uuid.value;
                                } else {
                                    sameNameCount++;
                                }
                                continue;
                            } else {
                                for (let c of n.__comps__) {
                                    if (c.cid == valueData.type) {
                                        if (!resUuid) {
                                            resUuid = c.value.uuid.value;
                                        } else {
                                            sameNameCount++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (!resUuid) {
                        resultArray.push({ key: key, succ: false, warn: `未找到类型为${valueData.type}的绑定`, sameCount: 0 })
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
            } else {
                let outStr = "";
                outStr += `❌${result.key}`;
                outStr += `\t(${result.warn})`;
                console.log(outStr);
            }
        }
    }
}

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() { }

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() { }
