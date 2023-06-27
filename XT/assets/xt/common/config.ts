import '../extern/log';

const DEFAULT_BUNDLE = 'resources';

function init(options?: xt.IXTOptions) {
    xt.config.DEFAULT_BUNDLE = options?.defaultBundle || DEFAULT_BUNDLE;
    xt.updateManager.init();
    xt.timerManager.init();
    xt.log('v' + xt.version)
}

declare global {
    interface IConfig {
        DEFAULT_BUNDLE: string
    }
    interface IXT {
        init: typeof init
        version: string
    }
    namespace xt {
        interface IXTOptions {
            defaultBundle: string
        }
    }
}

export { }

xt.config.DEFAULT_BUNDLE = xt.config.DEFAULT_BUNDLE || DEFAULT_BUNDLE;
xt.init = xt.init || init;
xt.version = '0.0.1'