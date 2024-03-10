import '../net-manager'
import '../../timer/timer-manager';

export abstract class NetBaseRequest {
    public requestMap: Map<xt.INetRequestKey, xt.INetRequestData> = new Map();

    public responseMap: Map<xt.INetResponseKey, xt.INetResponseData> = new Map();

    public abstract init(...args: any): any;

    public abstract onRequest(requestKey: xt.INetRequestKey, callBack?: (data?: xt.INetResponseType) => any): any;

    public abstract onResponse(data: xt.INetDecodeData): any;

    public abstract onClose(...args: any): any;

    public bindResponseCallBack(responseKey: xt.INetResponseKey, callBack?: xt.INetRequestCallBack): void {
        let responseData = this.responseMap.get(responseKey);
        if (responseData) {
            responseData.callBack = callBack;
        } else {
            this.responseMap.set(responseKey, <xt.INetResponseData>{ callBack })
        }
    }
}

declare global {
    namespace xt {
        type NetBaseRequest = InstanceType<typeof NetBaseRequest>
        interface INetRequestData {
            callBack?: xt.INetRequestCallBack,
            timerId: string
        }
        interface INetResponseData {
            callBack?: xt.INetRequestCallBack,
        }
    }
}