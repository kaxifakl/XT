import '../net-manager'

export abstract class NetBaseRequest {
    public abstract init(...args: any): any;

    public abstract onRequest(key: xt.INetSendKey, callBack?: (data?: xt.INetSendResData) => any): any;

    public abstract onResponse(key: xt.INetDecodeData): any;
}

declare global {
    namespace xt {
        type NetBaseRequest = InstanceType<typeof NetBaseRequest>
    }
}