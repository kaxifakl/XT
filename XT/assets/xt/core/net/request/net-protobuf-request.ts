import { NetBaseRequest } from "./net-base-request";

export class NetProtoBufRequest extends NetBaseRequest {
    public requestMap: Map<xt.INetSendKey, xt.INetResCallBack> = null;

    public init(...args: any): any {
        return this;
    }

    public onRequest(key: xt.INetSendKey, callBack?: (data?: xt.INetSendResData) => any): any {
        
    }

    public onResponse(key: xt.INetDecodeData): any {

    }
}