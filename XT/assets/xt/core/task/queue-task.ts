class QueueTask {
    private queueCalls: ((finish: () => void) => void)[] = [];

    private finishCall: () => void = null;

    constructor(queueCalls: ((finish: () => void) => void)[], finishCall: () => void) {
        this.queueCalls = queueCalls;
        this.finishCall = finishCall;
    }

    public start() {
        let call = this.queueCalls.shift();
        if (call == null) {
            this.finishCall();
            this.finishCall = null;
        } else {
            call(() => {
                this.start();
            })
        }
    }
}

declare global {
    interface IXT {
        QueueTask: typeof QueueTask
    }
    namespace xt {
        type QueueTask = InstanceType<typeof QueueTask>
    }
}

export { }

xt.QueueTask = xt.QueueTask || QueueTask