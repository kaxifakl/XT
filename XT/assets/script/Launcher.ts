import { _decorator, Component, Node, Prefab, SpriteFrame } from 'cc';
import { NetWebSocketClient } from '../xt/core/net/client/net-ws-client';
import { NetProtoBufCodec } from '../xt/core/net/codec/net-protobuf-codec';
import { NetProtoBufRequest } from '../xt/core/net/request/net-protobuf-request';
import { NetHeartPlugin } from './common/net/NetHeartPlugin';
const { ccclass, property } = _decorator;

@ccclass('Launcher')
export class Launcher extends Component {
    onLoad() {
        xt.init();
        xt.uiManager.init();

        xt.config.DEFAULT_BUNDLE = 'game';
        xt.util.loadBundles('game', () => {
            xt.uiManager.showUI(xt.ui.MainUI, null, {
                callBack: (ui: xt.ui.MainUI) => {

                }
            })
        })

        let client = new NetWebSocketClient().init({ url: "ws://127.0.0.1:8781" });
        let codec = new NetProtoBufCodec().init();
        let request = new NetProtoBufRequest().init();
        let heartPlugin = new NetHeartPlugin().init();

        xt.netManager.init(client, codec, request, [heartPlugin]);
        xt.netManager.connect(() => {
            xt.netManager.send("None", (data) => {

            })
        });
        xt.netManager.bindResponseCallBack('None2',(data)=>{
            console.log('bind');
        })
        // xt.netManger.send("Abc", { id: 1 });
    }
}
