/**UI容器基类 */
class BaseUIContainer {
    protected setUIActive(ui: xt.BaseUI, state: boolean): void {
        if (ui.node.active == true && state == false) {
            ui.node.active = false;
        } else if (ui.node.active == false && state == true) {
            ui.node.active = true;
        }
    }
}

declare global {
    interface IXT {
        BaseUIContainer: typeof BaseUIContainer
    }
    namespace xt {
        type BaseUIContainer = InstanceType<typeof BaseUIContainer>
    }
}

export { }

xt.BaseUIContainer = xt.BaseUIContainer || BaseUIContainer;