import { js } from 'cc';

class UIStackContainer extends xt.ui.BaseUIContainer implements xt.IUIContainer {

    private uiStack: xt.ui.BaseUI[] = [];
    private uiMap: Map<string, number> = new Map();

    public showUI<T extends xt.ui.BaseUI>(clazz: xt.Constructor<T>, param: any, options: xt.IUIOptions<T>): void {
        let className = js.getClassName(clazz);
        let uiIndex = this.uiMap.get(className);
        if (uiIndex != null) {
            this.removeOutStackUI(uiIndex);
            let ui = this.uiStack.pop();
            this.solveAnteriorUI(ui);
            this.uiStack.push(ui);
            ui.param = param;
            this.setUIActive(ui, true);
        } else {
            xt.uiManager.showUIMask();
            xt.XTComponent.prototype.createComponentNode(clazz, (comp: T) => {
                xt.uiManager.closeUIMask();
                //处理先前UI
                this.solveAnteriorUI(comp);
                this.uiStack.push(comp);
                this.uiMap.set(className, this.uiStack.length - 1);
                //赋值初始化
                comp.param = param;
                comp.node.setParent(options.uiParentNode);
                options?.callBack?.(comp);
            })
        }
    }

    public closeUI<T>(clazz: xt.Constructor<T>): void {
        let className = js.getClassName(clazz);
        let uiIndex = this.uiMap.get(className);
        if (uiIndex == null) {
            xt.error('该UI不存在', clazz);
            return;
        }

        if (uiIndex === this.uiStack.length - 1) {
            //关闭栈顶UI
            let ui = this.uiStack.pop();
            this.destroyUI(ui);
            //处理弹出的UI
            this.solvePopUI();
        } else {
            //关闭非栈顶UI,后面UI向前移,重新记录索引
            let ui = this.uiStack[uiIndex];
            this.destroyUI(ui);
            for (let i = uiIndex + 1, max = this.uiStack.length; i < max; i++) {
                let tempUI = this.uiStack[i];
                let className = js.getClassName(tempUI);
                this.uiStack[i - 1] = this.uiStack[i];
                this.uiMap.set(className, i - 1);
            }
            this.uiStack.length -= 1;
        }
    }

    public closeAllUI(): void {
        this.uiStack.forEach((ui) => {
            this.destroyUI(ui);
        })
        this.uiStack = [];
        this.uiMap.clear();
    }

    /**处理先前的UI */
    private solveAnteriorUI(nextUI: xt.ui.BaseUI): void {
        if (this.uiStack.length === 0) {
            return;
        }
        if (nextUI instanceof xt.ui.WindowUI) {
            //新的弹窗是窗口,循环关闭前一个UI,直到窗口UI
            for (let i = this.uiStack.length - 1; i >= 0; i--) {
                let ui = this.uiStack[i];
                this.setUIActive(ui, false);
                if (ui instanceof xt.ui.WindowUI) {
                    break;
                }
            }
        }
    }

    /**处理弹出的UI */
    private solvePopUI(): void {
        if (this.uiStack.length === 0) {
            return;
        }
        for (let i = this.uiStack.length - 1; i >= 0; i--) {
            let ui = this.uiStack[i];
            this.setUIActive(ui, true);
            if (ui instanceof xt.ui.WindowUI) {
                break;
            }
        }
    }

    /**移除溢栈的UI */
    private removeOutStackUI(index: number): void {
        let removeUIArray = this.uiStack.splice(index + 1, this.uiStack.length - index);
        for (let removeUI of removeUIArray) {
            this.destroyUI(removeUI);
        }
    }

    /**销毁UI */
    private destroyUI(ui: xt.ui.BaseUI): void {
        let className = js.getClassName(ui);
        ui.onClose();
        ui.removeAllListener();
        ui.node.destroy();
        xt.loaderManager.releaseLoader(className);
        this.uiMap.delete(className);
    }

    public getCurrentUI(): xt.ui.BaseUI {
        return this.uiStack[this.uiStack.length - 1];
    }
}

declare global {
    interface IXT {
        UIStackContainer: typeof UIStackContainer
    }
    namespace xt {
        type UIStackContainer = InstanceType<typeof UIStackContainer>
    }
}

export { }

xt.UIStackContainer = xt.UIStackContainer || UIStackContainer