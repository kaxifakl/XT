class SyncTask {
    private totalCount: number = 0;

    private keyMap: Map<string, boolean> = new Map();

    private finishCall: () => void = null;

    /**
     * @param keys 标识key数组
     * @param finishCall 所有异步任务执行完成后的回调
     */
    constructor(keys: string[], finishCall: () => void) {
        this.finishCall = finishCall;
        this.totalCount = keys.length;
        for (let key of keys) {
            this.keyMap.set(key, false);
        }
    }

    /**一个任务执行完成后调用,记录该任务已经完成
     * @param key 标识key
     * @returns 
     */
    public finish(key: string): boolean {
        let state = this.keyMap.get(key);
        if (state == null) {
            xt.error('can not find key:', key);
            return;
        }
        if (state === true) {
            xt.warn('the key has already finish:', key);
            return;
        }

        this.totalCount--;
        if (this.totalCount <= 0) {
            this.finishCall();
            this.finishCall = null;
        } else {
            this.keyMap.set(key, true);
        }
    }
}


declare global {
    interface IXT {
        /**异步任务 */
        SyncTask: typeof SyncTask
    }
    namespace xt {
        type SyncTask = InstanceType<typeof SyncTask>
    }
}

export { }

xt.SyncTask = xt.SyncTask || SyncTask;