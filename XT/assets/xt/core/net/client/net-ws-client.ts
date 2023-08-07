import { NetBaseClient } from "./net-base-client";
import '../../../extern/log/log'

export class NetWebSocketClient extends NetBaseClient {

    public url: string = null;

    public ws: WebSocket = null;

    public options: NetWebSocketClientOptions = null;

    private finishCall: () => void = null;

    public init(options: NetWebSocketClientOptions): NetWebSocketClient {
        this.options = options;
        return this;
    }

    public connect(finishCall: () => void): void {
        if (!this.options) {
            xt.error('options参数为空');
            return;
        }
        this.finishCall = finishCall;
        this.url = this.options.url;
        try {
            this.ws = new WebSocket(this.options.url, this.options.protocols);
            this.ws.binaryType = this.options.binaryType || 'arraybuffer';
            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onerror = this.onError.bind(this);
        } catch (err) {
            xt.error(err);
        }
    }

    public onOpen(ev: Event): any {
        xt.log('websocket连接成功')
        this.finishCall?.();
        this.finishCall = null;
    }

    public onMessage(ev: MessageEvent<any>) {
        xt.netManger.onMessage(ev.data);
    }

    public onClose(ev: CloseEvent) {
        this.reset();
        xt.log('websocket连接已关闭', ev)
        xt.netManger.onClose();
    }

    public onError(ev: Event) {
        this.reset();
        xt.log('websocket连接错误', ev)
    }

    public send(data: any): boolean {
        if (this.ws == null || this.ws.readyState != this.ws.OPEN) {
            xt.warn('websocket未开启,无法发送信息', this.ws?.readyState)
            return false;
        }
        this.ws.send(data);
        return true;
    }

    public close(...args: any) {
        this.reset();
    }

    public reset() {
        this.ws?.close();
        this.ws = null;
        this.finishCall = null;
        this.options = null;
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