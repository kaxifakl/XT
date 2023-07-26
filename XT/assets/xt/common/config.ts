import '../extern/log/log';

const DEFAULT_BUNDLE = 'resources';

/**初始化
 * @param options 参数
 */
function init(options?: xt.IXTOptions) {
    xt.config.DEFAULT_BUNDLE = options?.defaultBundle || DEFAULT_BUNDLE;
    xt.updateManager.init();
    xt.timerManager.init();
    xt.log('v' + xt.version)
}

declare global {
    interface IConfig {
        /**内置默认bundle */
        DEFAULT_BUNDLE: string
    }
    interface IXT {
        init: typeof init
        version: string
    }
    namespace xt {
        interface IXTOptions {
            /**设置默认bundle */
            defaultBundle: string
        }
    }
}

export { }

xt.config.DEFAULT_BUNDLE = xt.config.DEFAULT_BUNDLE || DEFAULT_BUNDLE;
xt.init = xt.init || init;
xt.version = '0.0.1'