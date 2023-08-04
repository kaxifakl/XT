class NetManger {
    public client: xt.NetBaseClient = null;
    public codec: xt.NetBaseCodec = null;

    public init<T extends xt.NetBaseClient, T2 extends xt.NetBaseCodec>(client: T, codec: T2): void {
        this.client = client;
        this.codec = codec;
    }

    public connect(finishCall: () => void): void {

    }

    public reconnect(): void {

    }

    public close(): void {

    }

    public send(key: xt.NetKeyType, data?: INetData): void {

    }

}

declare global {
    interface IXT {
        NetManger: NetManger
    }
    interface INetData {

    }
    namespace xt {
        type NetKeyType = string | number
    }
}

export { }

xt.NetManger = xt.NetManger || new NetManger()