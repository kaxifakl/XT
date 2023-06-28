class BaseUIContainer {
    protected setUIActive(ui: xt.ui.BaseUI, state: boolean): void {
        if (ui.node.active == true && state == false) {
            ui.node.active = false;
        } else if (ui.node.active == false && state == true) {
            ui.node.active = true;
        }
    }
}

declare global {
    interface IUI {
        /**UI容器基类 */
        BaseUIContainer: typeof BaseUIContainer
    }
    namespace xt.ui {
        type BaseUIContainer = InstanceType<typeof BaseUIContainer>
    }
}

export { }

xt.ui.BaseUIContainer = xt.ui.BaseUIContainer || BaseUIContainer;