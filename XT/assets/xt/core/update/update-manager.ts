import { ISchedulable, director } from "cc";
import '../../util/symbol-key';
import '../../common/enum';

class UpdateManager implements ISchedulable {
    public uuid?: string = null;
    public id?: string = null;

    public state: xt.UpdateState = xt.enum.UpdateState.Stop;

    public updateSystemMap: Map<string, xt.IUpdateSystem> = new Map();

    public init(): void {
        this.id = xt.symbolKey.getKey();
        director.getScheduler().scheduleUpdate(this, 200, false);
        this.start();
    }

    public update(dt: number): void {
        if (this.state === xt.enum.UpdateState.Stop) {
            return;
        }
        this.updateSystemMap.forEach((system) => {
            if (system.state === xt.enum.UpdateState.Start) {
                system.update(dt);
            }
        })
    }

    public stop(): void {
        this.state = xt.enum.UpdateState.Stop;
    }

    public start(): void {
        this.state = xt.enum.UpdateState.Start;
    }

    /**注册系统
     * @param system 
     */
    public registerSystem(system: xt.IUpdateSystem): void {
        system.id = system.id || xt.symbolKey.getKey();
        this.updateSystemMap.set(system.id, system);
    }

    /**注销系统
     * @param system 
     */
    public unregisterSystem(system: xt.IUpdateSystem): void {
        this.updateSystemMap.delete(system.id);
    }
}

declare global {
    interface IXT {
        /**循环系统 */
        updateManager: UpdateManager
    }
    namespace xt {
        interface IUpdateSystem {
            id?: string;
            state: number;
            update(dt: number): void;
        }
    }
}

export { }

xt.updateManager = xt.updateManager || new UpdateManager();