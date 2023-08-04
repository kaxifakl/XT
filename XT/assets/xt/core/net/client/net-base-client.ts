export abstract class NetBaseClient implements xt.INetClientFunction {

    public abstract init(...args: any): NetBaseClient;

    public abstract connect(...args: any): any;

    public onopen: (...args: any) => any;
    public onmessage: (...args: any) => any;
    public onclose: (...args: any) => any;
    public onerror: (...args: any) => any;
}

declare global {
    namespace xt {
        type NetBaseClient = InstanceType<typeof NetBaseClient>
        interface INetClientFunction {
            onopen: (...args: any) => any
            onmessage: (...args: any) => any
            onclose: (...args: any) => any
            onerror: (...args: any) => any
        }
    }
}

export { }