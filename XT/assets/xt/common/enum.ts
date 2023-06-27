const UpdateState = {
    Stop: 0,
    Start: 1
}

declare global {
    interface IEnum {
        UpdateState: typeof UpdateState
    }
    namespace xt {
        type UpdateState = ThisType<UpdateState>;
    }
}

export { }

xt.enum.UpdateState = UpdateState;