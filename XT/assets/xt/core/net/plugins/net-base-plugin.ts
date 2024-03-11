import '../net-manager'

export abstract class NetBasePlugin {
    public abstract init(...args: any): any;

    public abstract onOpen(...args: any): any;

    public abstract onMessage(...args: any): any;

    public abstract onClose(...args: any): any;
}

declare global {
    namespace xt {
        type NetBasePlugin = InstanceType<typeof NetBasePlugin>
    }
}