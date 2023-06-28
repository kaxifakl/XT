/**可选参数解析
 * @param onProgress 
 * @param onFinish 
 * @param bundle 
 * @returns 
 */
function parseLoadArgs<T>(onProgress: xt.AssetOnProgress | xt.AssetOnFinish<T>, onFinish: xt.AssetOnFinish<T> | string | null, bundle: string | null): { onProgress: xt.AssetOnProgress, onFinish: xt.AssetOnFinish<T>, bundle: string } {
    let onProgressOut: any = onProgress;
    let onFinishOut: any = onFinish;
    let bundleOut: any = bundle;
    if (bundle == null) {
        if (onFinish == null) {
            onFinishOut = onProgress;
            onProgressOut = null;
        } else if (typeof onFinish === 'string') {
            onProgressOut = null;
            onFinishOut = onProgress;
            bundleOut = onFinish;
        }
    }

    return { onProgress: onProgressOut, onFinish: onFinishOut, bundle: bundleOut }
}

declare global {
    interface IUtil {
        parseLoadArgs: typeof parseLoadArgs
    }
}

export { }

xt.util.parseLoadArgs = xt.util.parseLoadArgs || parseLoadArgs;