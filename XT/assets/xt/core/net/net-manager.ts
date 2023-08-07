class NetManger {
    public client: xt.NetBaseClient = null;
    public codec: xt.NetBaseCodec = null;
    public request: xt.NetBaseRequest = null;
    public plugins: xt.NetBasePlugin[] = null;

    public init(client: xt.NetBaseClient, codec: xt.NetBaseCodec, request: xt.NetBaseRequest, plugins?: xt.NetBasePlugin[]): void {
        this.client = client;
        this.codec = codec;
        this.request = request;
        this.plugins = plugins || [];
    }

    public connect(finishCall?: () => void): void {
        this.client.connect(() => {
            for (let plugin of this.plugins) {
                plugin.onOpen();
            }
            finishCall?.();
        });
    }

    public reconnect(): void {

    }

    public close(): void {
        this.client.close();
    }

    public onMessage(data?: any): void {
        let decodeData = this.codec.decode(data);
        for (let plugin of this.plugins) {
            plugin.onMessage(decodeData);
        }
        this.request.onResponse(decodeData);
    }

    public onClose(data?: any): void {
        for (let plugin of this.plugins) {
            plugin.onClose();
        }
    }

    public send(key: xt.INetSendKey, callBack?: xt.INetResCallBack): void
    public send(key: xt.INetSendKey, data?: xt.INetSendData | xt.INetResCallBack, callBack?: xt.INetResCallBack): void {
        if (typeof data == 'function') {
            callBack = data;
            data = null;
        }
        let encodeData = this.codec.encode(key, data as xt.INetSendData);
        if (encodeData == null) {
            return;
        }
        let succ = this.client.send(encodeData);
        if (!succ) {
            return;
        }
        this.request.onRequest(key, callBack);
    }
}

declare global {
    interface IXT {
        netManger: NetManger
    }
    interface INetMsgParams {
        Abc: {
            req: { id: number }
            res: { res: number }
        }
        Cbc: {
            req: { id: number }
            res: { res: number }
        }
    }
    namespace xt {
        type INetSendKey = keyof INetMsgParams;
        type INetSendData = INetMsgParams[keyof INetMsgParams]['req'];
        type INetSendResData = INetMsgParams[keyof INetMsgParams]['res'];
        type INetDecodeData = { key: any, data: any, requestKey: INetSendKey }
        type INetResCallBack = (data?: xt.INetSendResData) => any;
    }
}

export { }

xt.netManger = xt.netManger || new NetManger()