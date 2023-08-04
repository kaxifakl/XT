import { _decorator, Component, Node, Prefab, SpriteFrame } from 'cc';
import { NetWebSocketClient } from '../xt/core/net/client/net-ws-client';
import { NetProtoBufCodec } from '../xt/core/net/codec/net-protobuf-codec';
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

        let client = new NetWebSocketClient().init({ url: "" });
        let codec = new NetProtoBufCodec().init();
        xt.NetManger.init(client, codec);
        xt.NetManger.send('1', 2);
    }
}


