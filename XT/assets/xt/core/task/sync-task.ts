class SyncTask {
    private totalCount: number = 0;

    private keyMap: Map<string, boolean> = new Map();

    private finishCall: () => void = null;

    constructor(keys: string[], finishCall: () => void) {
        this.finishCall = finishCall;
        this.totalCount = keys.length;
        for (let key of keys) {
            this.keyMap.set(key, false);
        }
    }

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
        SyncTask: typeof SyncTask
    }
    namespace xt {
        type SyncTask = InstanceType<typeof SyncTask>
    }
}

export { }

xt.SyncTask = xt.SyncTask || SyncTask;