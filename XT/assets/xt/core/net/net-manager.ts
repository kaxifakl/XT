class NetManger {
    public client: xt.NetBaseClient = null;
    public codec: xt.NetBaseCodec = null;
    public request: xt.NetBaseRequest = null;
    public plugins: xt.NetBasePlugin[] = null;

    private reconnectTimerId: string = null;

    public init(client: xt.NetBaseClient, codec: xt.NetBaseCodec, request: xt.NetBaseRequest, plugins?: xt.NetBasePlugin[]): void {
        this.client = client;
        this.codec = codec;
        this.request = request;
        this.plugins = plugins || [];
    }

    public connect(finishCall?: () => void): void {
        this.reset();
        this.client.connect(() => {
            for (let plugin of this.plugins) {
                plugin.onOpen();
            }
            finishCall?.();
        });
    }

    private reconnect(finishCall?: () => void): void {
        this.client.close(true);
        this.reconnectTimerId = xt.timerManager.addTimer(3, () => {
            this.connect(finishCall)
        }, true)
    }

    public close(): void {
        this.client.close(true);
        this.reset();
    }

    public onMessage(data?: any): void {
        let decodeData = this.codec.decode(data);
        for (let plugin of this.plugins) {
            plugin.onMessage(decodeData);
        }
        this.request.onResponse(decodeData);
    }

    public onClose(autoConnect: boolean, data?: any): void {
        for (let plugin of this.plugins) {
            plugin.onClose();
        }
        this.request.onClose();
        if (autoConnect) {
            xt.log('自动重连中...')
            this.reconnect();
        }
    }

    public send(key: xt.INetRequestKey, callBack?: xt.INetRequestCallBack): void
    public send(key: xt.INetRequestKey, data?: xt.INetRequestType | xt.INetRequestCallBack, callBack?: xt.INetRequestCallBack): void {
        if (typeof data == 'function') {
            callBack = data;
            data = null;
        }
        let encodeData = this.codec.encode(key, data as xt.INetRequestType);
        if (encodeData == null) {
            return;
        }
        let succ = this.client.send(encodeData);
        if (!succ) {
            return;
        }
        this.request.onRequest(key, callBack);
    }

    public bindResponseCallBack(key: xt.INetResponseKey, callBack?: xt.INetRequestCallBack): void {
        this.request.bindResponseCallBack(key, callBack);
    }

    public reset() {
        if (this.reconnectTimerId) {
            xt.timerManager.removeTimer(this.reconnectTimerId);
            this.reconnectTimerId = null;
        }
    }
}

declare global {
    interface IXT {
        netManager: NetManger
    }
    interface INetMsgParams {
        None: {
            req: any
            res: any
        }
    }

    interface INetKeyPairParams {
        None2: "None"
    }

    namespace xt {
        type INetRequestKey = keyof INetMsgParams
        type INetRequestType = INetMsgParams[keyof INetMsgParams]['req']
        type INetResponseType = INetMsgParams[keyof INetMsgParams]['res']
        type INetDecodeData = { responseKey: INetResponseKey, data: any, requestKey: INetRequestKey }
        type INetRequestCallBack = (data?: xt.INetResponseType) => any;
        type INetResponseKey = keyof INetKeyPairParams
        type INetResponseCallBack = (data?: INetMsgParams[INetKeyPairParams[INetResponseKey]]['res']) => any;
    }
}

export { }

xt.netManager = xt.netManager || new NetManger()