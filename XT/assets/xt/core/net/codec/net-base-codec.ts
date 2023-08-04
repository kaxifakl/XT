import '../net-manager'

export abstract class NetBaseCodec {

    public abstract init(...args: any): NetBaseCodec;

    public abstract connect(...args: any): any;
}

declare global {
    namespace xt {
        type NetBaseCodec = InstanceType<typeof NetBaseCodec>
    }
}

export { }