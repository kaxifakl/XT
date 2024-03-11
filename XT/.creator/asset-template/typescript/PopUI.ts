import { _decorator, Component, Node } from 'cc';
import { PopUI } from '../../xt/core/ui/src/pop-ui';
const { ccclass, property } = _decorator;

declare global {
    interface IUI { <%UnderscoreCaseClassName%>: typeof <%UnderscoreCaseClassName%> }
    namespace xt.ui { type <%UnderscoreCaseClassName%> = InstanceType<typeof <%UnderscoreCaseClassName%>> }
}

interface <%UnderscoreCaseClassName%>Param {
    
}

@xt.decorator.setPrefab('prefab/<%UnderscoreCaseClassName%>')
@ccclass('<%UnderscoreCaseClassName%>')
export class <%UnderscoreCaseClassName%><Param extends <%UnderscoreCaseClassName%>Param = <%UnderscoreCaseClassName%>Param> extends PopUI<<%UnderscoreCaseClassName%>Param> {
    
}

xt.ui.<%UnderscoreCaseClassName%> = <%UnderscoreCaseClassName%>;