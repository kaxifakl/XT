import '../net-manager'

export abstract class NetBaseCodec {

    public abstract init(...args: any): NetBaseCodec;

    public abstract encode(key: xt.INetSendKey, data: xt.INetSendData): any;

    public abstract decode(data?: any): xt.INetDecodeData;

}

declare global {
    namespace xt {
        type NetBaseCodec = InstanceType<typeof NetBaseCodec>
    }
}

export { }