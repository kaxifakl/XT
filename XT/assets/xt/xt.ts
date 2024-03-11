declare global {
    const xt: IXT;
    interface IXT {
        /**工具 */
        util: IUtil
        /**配置 */
        config: IConfig
        /**枚举 */
        enum: IEnum
        /**游戏业务 */
        game: IGame
        /**ui框架 */
        ui: IUI
        /**数据类 */
        data: IData
        /**装饰器 */
        decorator: IDecorator
    }
    interface IUtil { }
    interface IConfig { }
    interface IEnum { }
    interface IGame { }
    interface IUI { }
    interface IData { }
    interface IManager { }
    interface IDecorator { }
    namespace xt { }
}

export { }