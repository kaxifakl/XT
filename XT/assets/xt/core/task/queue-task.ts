class QueueTask {
    private queueCalls: ((finish: () => void) => void)[] = [];

    private finishCall: () => void = null;


    /**
     * @param finishCall 所有任务执行完成后的回调
     */
    constructor(finishCall: () => void)
    /**
     * @param queueCalls 任务数组
     * @param finishCall 所有任务执行完成后的回调
     */
    constructor(queueCalls: ((finish: () => void) => void)[], finishCall: () => void)
    constructor(queueCalls?: (((finish: () => void) => void)[]) | (() => void), finishCall?: () => void) {
        if (Array.isArray(queueCalls)) {
            this.queueCalls = queueCalls;
            this.finishCall = finishCall;
        } else {
            this.finishCall = queueCalls;
        }
    }

    /**添加队列任务
     * @param task 队列任务
     */
    public add(task: (finish: () => void) => void): void {
        this.queueCalls.push(task);
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