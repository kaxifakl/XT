import { assetManager } from "cc";

declare global {
    interface IUtil {
        loadBundles: typeof loadBundles
    }
}
export { }

function loadBundles(bundleOrUrls: string | string[], onFinish: xt.BundleOnFinish): void;
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