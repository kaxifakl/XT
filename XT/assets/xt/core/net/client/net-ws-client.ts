import { NetBaseClient } from "./net-base-client";
import '../../../extern/log/log'

export class NetWebSocketClient extends NetBaseClient {

    public url: string = null;

    public ws: WebSocket = null;

    public init(options: NetWebSocketClientOptions): NetWebSocketClient {
        if (!options) {
            xt.error('options参数为空');
            return;
        }
        this.url = options.url;
        this.ws = new WebSocket(options.url, options.protocols);
        this.ws.binaryType = options.binaryType || 'arraybuffer';
        this.ws.onopen
        return this;
    }

    public connect(): void {

    }
}

interface NetWebSocketClientOptions {
    url: string
    protocols?: string | string[]
    binaryType?: 'arraybuffer' | 'blob'
}

declare global {
    namespace xt {
        type INetWebSocketClientOptions = NetWebSocketClientOptions
    }
}