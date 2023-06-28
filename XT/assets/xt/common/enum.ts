const UpdateState = {
    /**停止 */
    Stop: 0,
    /**开始 */
    Start: 1
}

declare global {
    interface IEnum {
        /**循环状态 */
        UpdateState: typeof UpdateState
    }
    namespace xt {
        type UpdateState = ThisType<UpdateState>;
    }
}

export { }

xt.enum.UpdateState = UpdateState;