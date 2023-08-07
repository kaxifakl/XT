import { NetBasePlugin } from "../../../xt/core/net/plugins/net-base-plugin";

export class NetHeartPlugin extends NetBasePlugin {
    public timer: string = null;

    public init(...args: any) {
        return this;
    }

    public onOpen(...args: any) {
        console.log('plugin start');
        this.timer = xt.timerManager.addTimer(5, () => {
            xt.netManger.send('Cbc')
        })
    }

    public onMessage(...args: any) {
        console.log('plugin message');
    }

    public onClose(...args: any) {
        xt.timerManager.removeTimer(this.timer);
        console.log('plugin close');
    }

}