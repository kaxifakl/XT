import { assetManager } from "cc";

declare global {
    interface IUtil {
        loadBundles: typeof loadBundles
    }
}
export { }

/**加载AssetBundle
 * @param bundleOrUrls bundle名或地址
 * @param onFinish 完成回调
 */
function loadBundles(bundleOrUrls: string | string[], onFinish: xt.BundleOnFinish): void;
/**加载AssetBundle
 * @param bundleOrUrls bundle名或地址
 * @param onProgress 进度回调
 * @param onFinish 完成回调
 */
function loadBundles(bundleOrUrls: string | string[], onProgress: xt.BundleOnProgress, onFinish: xt.BundleOnFinish): void;
function loadBundles(bundleOrUrls: string | string[], onProgress?: xt.BundleOnProgress | xt.BundleOnFinish, onFinish?: xt.BundleOnFinish): void {
    if (onFinish == null) {
        onFinish = onProgress as xt.BundleOnFinish;
        onProgress = null;
    }
    if (!Array.isArray(bundleOrUrls)) {
        bundleOrUrls = [bundleOrUrls];
    }
    let totalCount = 0;
    for (let i = 0; i < bundleOrUrls.length; i++) {
        assetManager.loadBundle(bundleOrUrls[i], () => {
            totalCount++;
            onProgress?.(totalCount, bundleOrUrls.length);
            if (totalCount >= bundleOrUrls.length) {
                onFinish();
            }
        })
    }
}

xt.util.loadBundles = xt.util.loadBundles || loadBundles;