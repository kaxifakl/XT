import { NetBaseCodec } from './net-base-codec'

export class NetProtoBufCodec extends NetBaseCodec {

    public init(): NetProtoBufCodec { return this };

    public encode(key: xt.INetRequestKey, data?: xt.INetRequestType): any {
        let u = new Uint8Array(123)
        return u;
    }

    public decode(data?: any): xt.INetDecodeData {
        console.log(data);
        return { responseKey: "None2", data, requestKey: "None" }
    }
}