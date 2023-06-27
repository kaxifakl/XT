class LoaderManager {
    private loaderMap: Map<string, xt.AssetLoader> = new Map();

    /**缓存模式下loader不会从map中删除 */
    public cacheMode: boolean = false;

    /**获取一个loader
     * @param key loader key
     * @returns 
     */
    public getLoader(key: string): xt.AssetLoader {
        let loader = this.loaderMap.get(key);
        if (loader) {
            return loader;
        }
        loader = new xt.AssetLoader(key);
        this.loaderMap.set(key, loader);
        return loader;
    }

    /**归还loader,归还时会自动释放掉loader中的资源 */
    public releaseLoader(loaderOrLoaderName: xt.AssetLoader | string): void {
        if (typeof loaderOrLoaderName === 'string') {
            loaderOrLoaderName = this.loaderMap.get(loaderOrLoaderName);
            if (loaderOrLoaderName == null) {
                xt.warn('can not find loader:', loaderOrLoaderName);
                return;
            }
        }

        if (!this.cacheMode) {
            this.loaderMap.delete(loaderOrLoaderName.key);
        }
        loaderOrLoaderName.release();
    }
}

declare global {
    interface IXT {
        loaderManager: LoaderManager
    }
}

export { }

xt.loaderManager = xt.loaderManager || new LoaderManager()