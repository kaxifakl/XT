import '../net-manager'
import { NetBaseCodec } from './net-base-codec'

export class NetProtoBufCodec extends NetBaseCodec {
    constructor() {
        super();
    }

    public init(): NetProtoBufCodec { return this };

    public connect(): void { };
}

declare global {
    namespace xt {
        type NetProtoBufCodec = ThisType<NetProtoBufCodec>
    }
}

export { }