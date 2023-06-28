declare global {
    const xt: IXT;
    interface IXT {
        util: IUtil
        config: IConfig
        enum: IEnum
        game: IGame
    }
    interface IUtil { }
    interface IConfig { }
    interface IEnum { }
    interface IGame { }
    namespace xt { }
}

export { }