import '../net-manager'

export abstract class NetBaseClient implements xt.INetClientFunction {
    public autoConnect: boolean = true;

    public abstract init(...args: any): NetBaseClient;

    public abstract connect(...args: any): any;

    public abstract close(force: boolean, ...args: any): any;

    public abstract send(...args: any): any;

    public onOpen(...args: any): any { };
    public onMessage(...args: any): any { };
    public onClose(...args: any): any { };
    public onError(...args: any): any { };
}

declare global {
    namespace xt {
        type NetBaseClient = InstanceType<typeof NetBaseClient>
        interface INetClientFunction {
            onOpen(...args: any): any
            onMessage(...args: any): any
            onClose(...args: any): any
            onError(...args: any): any
        }
    }
}

export { }