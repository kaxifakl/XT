import { NetBaseRequest } from "./net-base-request";

export class NetProtoBufRequest extends NetBaseRequest {

    public timeout: number = 3;

    public init(...args: any): any {
        return this;
    }

    public onRequest(key: xt.INetRequestKey, callBack?: (data?: xt.INetResponseType) => any): any {
        let requestData = this.requestMap.get(key);
        if (!requestData) {
            let timerId = xt.timerManager.addTimer(3, () => {
                xt.timerManager.removeTimer(timerId);
                this.requestMap.delete(key)
            }, true);
            requestData = <xt.INetRequestData>{ callBack, timerId };
            this.requestMap.set(key, requestData);
            return;
        }
        xt.timerManager.getTimer(requestData.timerId).reset();
        requestData.callBack = callBack;
    }

    public onResponse(data: xt.INetDecodeData): any {
        let requestData = this.requestMap.get(data.requestKey);
        if (requestData) {
            requestData.callBack?.(data.data);
            xt.timerManager.removeTimer(requestData.timerId);
            this.requestMap.delete(data.requestKey);
        }
        let responseData = this.responseMap.get(data.responseKey);
        if (responseData) {
            responseData.callBack?.(data.data);
        }
    }

    public onClose(...args: any): any {
        this.requestMap.forEach((requestData) => {
            xt.timerManager.removeTimer(requestData.timerId);
        })
        this.requestMap.clear();
    }
}