import { Asset, SpriteFrame, Texture2D, assetManager, js } from "cc";
import '../../util/symbol-key';
import '../../util/parse';
import '../../common/config';
import '../../extern/log';
import '../timer/timer-manager'

class AssetLoader {
    /**版本标记 */
    private flag: number = 0;

    /**标识key */
    public key: string = null;

    /**单个资源的缓存 */
    public cacheMap: Map<string, Asset> = new Map();
    /**文件夹资源的缓存 */
    public arrayCacheMap: Map<string, Array<Asset>> = new Map();

    constructor(key?: string) {
        this.key = key || xt.symbolKey.getKey();
    }

    /**加载单个资源
     * @param url 地址
     * @param type 资源类型
     * @param onFinish 成功回调
     * @param bundle AssetBundle名
     * @returns 
     */
    public load<T extends Asset>(url: string, type: xt.Constructor<T>, onFinish: xt.AssetOnFinish<T>, bundle?: string): void;
    /**加载单个资源
     * @param url 地址
     * @param type 资源类型
     * @param onProgress 进度回调
     * @param onFinish 成功回调
     * @param bundle AssetBundle名
     * @returns 
     */
    public load<T extends Asset>(url: string, type: xt.Constructor<T>, onProgress: xt.AssetOnProgress, onFinish: xt.AssetOnFinish<T>, bundle?: string): void;
    /**加载单个资源
     * @param url 地址
     * @param type 资源类型
     * @param onProgress 进度回调
     * @param onFinish 成功回调
     * @param bundle AssetBundle名
     * @returns 
     */
    public load<T extends Asset>(url: string, type: xt.Constructor<T>, onProgress?: xt.AssetOnProgress | xt.AssetOnFinish<T>, onFinish?: xt.AssetOnFinish<T> | string, bundle?: string): void {
        let { onProgress: _onProgress, onFinish: _onFinish, bundle: _bundle } = xt.util.parseLoadArgs(onProgress, onFinish, bundle);
        _bundle = _bundle || xt.config.DEFAULT_BUNDLE;

        let bundleAsset = assetManager.getBundle(_bundle);
        if (!bundleAsset) {
            xt.error('can not find bundle:', _bundle);
            return;
        }
        url = adapterUrl(url, type);
        let cacheKey = getCacheKey(bundle, type, url);
        let cacheAsset = this.cacheMap.get(cacheKey);
        if (cacheAsset != null) {
            _onFinish?.(cacheAsset as T);
            return;
        }

        let flag = this.flag;
        bundleAsset.load(url, type, _onProgress, (err: Error, asset: T) => {
            if (err) {
                xt.error('can not find resource:', url, _bundle)
                _onFinish?.(null);
                return;
            }
            if (flag === this.flag) {
                this.cacheMap.set(cacheKey, asset);
                asset.addRef();
                _onFinish?.(asset);
            } else {
                asset.addRef();
                asset.decRef();
            }
        })
    }

    /**加载资源文件夹
     * @param url 地址
     * @param type 资源类型
     * @param onFinish 成功回调
     * @param bundle AssetBundle名
     * @returns 
     */
    public loadDir<T extends Asset>(url: string, type: xt.Constructor<T>, onFinish: xt.AssetsOnFinish<T>, bundle?: string): void;
    /**加载资源文件夹
     * @param url 地址
     * @param type 资源类型
     * @param onProgress 进度回调
     * @param onFinish 成功回调
     * @param bundle AssetBundle名
     * @returns 
     */
    public loadDir<T extends Asset>(url: string, type: xt.Constructor<T>, onProgress: xt.AssetOnProgress, onFinish: xt.AssetsOnFinish<T>, bundle?: string): void;
    /**加载资源文件夹
     * @param url 地址
     * @param type 资源类型
     * @param onProgress 进度回调
     * @param onFinish 成功回调
     * @param bundle AssetBundle名
     * @returns 
     */
    public loadDir<T extends Asset>(url: string, type: xt.Constructor<T>, onProgress?: xt.AssetOnProgress | xt.AssetsOnFinish<T>, onFinish?: xt.AssetsOnFinish<T> | string, bundle?: string): void {
        let { onProgress: _onProgress, onFinish: _onFinish, bundle: _bundle } = xt.util.parseLoadArgs(onProgress, onFinish, bundle);
        _bundle = _bundle || xt.config.DEFAULT_BUNDLE;

        let bundleAsset = assetManager.getBundle(_bundle);
        if (!bundleAsset) {
            return;
        }
        url = adapterUrl(url, type);
        let cacheKey = getCacheKey(bundle, type, url);
        let cacheAsset = this.arrayCacheMap.get(cacheKey);
        if (cacheAsset != null) {
            _onFinish?.(cacheAsset as T[]);
            return;
        }

        let flag = this.flag;
        bundleAsset.loadDir(url, type, _onProgress, (err: Error, assets: T[]) => {
            if (err) {
                xt.error('can not find resource:', url, _bundle)
                _onFinish?.(null);
                return;
            }
            if (flag === this.flag) {
                this.arrayCacheMap.set(cacheKey, assets);
                for (let asset of assets) {
                    asset.addRef();
                }
                _onFinish?.(assets);
            } else {
                for (let asset of assets) {
                    asset.addRef();
                    asset.decRef();
                }
            }
        })
    }

    /**
     * 释放资源加载器,默认延时3秒释放资源
     */
    public release() {
        let asset = this.cacheMap.values();
        let assets = this.arrayCacheMap.values();

        xt.timerManager.addTimer(3, () => {
            for (let a of asset) {
                a.decRef();
            }
            for (let a of assets) {
                for (let b of a) {
                    b.decRef();
                }
            }
        }, true);

        this.cacheMap.clear();
        this.arrayCacheMap.clear();
        this.flag++;
    }
}

function getCacheKey<T>(bundle: string, type: xt.Constructor<T>, url: string): string {
    let typeStr = js.getClassName(type);
    return bundle + '-' + typeStr + '-' + url;
}

function adapterUrl<T>(url: string, type: xt.Constructor<T>): string {
    if (type as T === SpriteFrame) {
        if (!url.endsWith('/spriteFrame')) {
            url += '/spriteFrame'
        }
    } else if (type as T === Texture2D) {
        if (!url.endsWith('/texture')) {
            url += '/texture'
        }
    }
    return url
}

declare global {
    interface IXT {
        /**资源加载器 */
        AssetLoader: typeof AssetLoader
    }
    namespace xt {
        type AssetLoader = InstanceType<typeof AssetLoader>
    }
}

xt.AssetLoader = xt.AssetLoader || AssetLoader;