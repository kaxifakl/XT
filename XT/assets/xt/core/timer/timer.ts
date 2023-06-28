class Timer {
    public id: string = null;
    private interval: number = null;
    private callBack: (dt?: number) => void = null;
    private time: number = 0;
    private once: boolean = null;
    public hasDone: boolean = false;
    public pause: boolean = false;
    constructor(id: string, interval: number, callBack: (dt?: number) => void, once: boolean) {
        this.id = id;
        this.interval = interval;
        this.callBack = callBack;
        this.once = once;
    }

    public update(dt: number): void {
        if (this.pause) {
            return;
        }
        if (this.interval === 0) {
            this.callBack && this.callBack(dt);
            if (this.once) {
                this.hasDone = true;
            }
            return;
        }
        this.time += dt;
        if (this.time >= this.interval) {
            this.time -= this.interval;
            this.callBack && this.callBack(this.interval);
            if (this.once) {
                this.hasDone = true;
            }
        }
    }

    public reset() {
        this.time = 0;
    }
}


declare global {
    interface IXT {
        /**计时器 */
        Timer: typeof Timer
    }
    namespace xt {
        type Timer = InstanceType<typeof Timer>
    }
}

export { }

xt.Timer = xt.Timer || Timer;