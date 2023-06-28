class QueueTask {
    private queueCalls: ((finish: () => void) => void)[] = [];

    private finishCall: () => void = null;

    /**
     * @param queueCalls 任务数组
     * @param finishCall 所有任务执行完成后的回调
     */
    constructor(queueCalls: ((finish: () => void) => void)[], finishCall: () => void) {
        this.queueCalls = queueCalls;
        this.finishCall = finishCall;
    }

    /**开始执行 */
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
        /**队列顺序执行任务 */
        QueueTask: typeof QueueTask
    }
    namespace xt {
        type QueueTask = InstanceType<typeof QueueTask>
    }
}

export { }

xt.QueueTask = xt.QueueTask || QueueTask