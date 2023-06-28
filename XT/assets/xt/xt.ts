declare global {
    const xt: IXT;
    interface IXT {
        util: IUtil
        config: IConfig
        enum: IEnum
        game: IGame
        ui: IUI
        data: IData
    }
    interface IUtil { }
    interface IConfig { }
    interface IEnum { }
    interface IGame { }
    interface IUI { }
    interface IData { }
    interface IBundle { }
    namespace xt { }
}

export { }