declare global {
    const xt: IXT;
    interface IXT {
        util: IUtil
        config: IConfig
        enum: IEnum
    }
    interface IUtil { }
    interface IConfig { }
    interface IEnum { }
    namespace xt { }
}

export { }