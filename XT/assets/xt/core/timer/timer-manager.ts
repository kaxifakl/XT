import '../update/update-manager';
import './timer';
import '../../util/symbol-key';

class TimerManager implements xt.IUpdateSystem {
    state: number = xt.enum.UpdateState.Start;

    private timerMap: Map<string, xt.Timer> = new Map();

    public init(): void {
        xt.updateManager.registerSystem(this);
    }

    /**增加1个计时器
     * @param interval 间隔,如果填0则每帧执行
     * @param callBack 回调
     * @param once 是否只执行一次
     * @returns 
     */
    public addTimer(interval: number, callBack: (dt?: number) => void, once: boolean = false): string {
        let id = this.getTimerId();
        let timer = new xt.Timer(id, interval, callBack, once);
        this.timerMap.set(id, timer);
        return id;
    }

    private getTimerId(): string {
        return xt.symbolKey.getKey('timer');
    }

    public update(dt: number): void {
        this.timerMap.forEach((timer: xt.Timer, id: string) => {
            timer.update(dt);
            if (timer.hasDone) {
                this.timerMap.delete(id);
            }
        })
    }

    /**根据id移除timer
     * @param id 
     */
    public removeTimer(id: string): void {
        this.timerMap.delete(id);
    }

    /**根据id获取timer
     * @param id 
     * @returns 
     */
    public getTimer(id: string): xt.Timer {
        return this.timerMap.get(id);
    }

    /**暂停timer
     * @param id
     */
    public pauseTimer(id: string): void {
        let timer = this.timerMap.get(id);
        if (timer) {
            timer.pause = true;
        }
    }

    /**恢复timer
     * @param id
     */
    public resumeTimer(id: string): void {
        let timer = this.timerMap.get(id);
        if (timer) {
            timer.pause = false;
        }
    }

    /**重置timer.time,不会恢复状态 */
    public resetTimer(id: string): void {
        let timer = this.timerMap.get(id);
        if (timer) {
            timer.reset();
        }
    }
}

declare global {
    interface IXT {
        /**计时器管理类 */
        timerManager: TimerManager
    }
}

export { }

xt.timerManager = xt.timerManager || new TimerManager()