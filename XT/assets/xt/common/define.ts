import { AssetManager } from "cc";

declare global {
    interface IXT {
        /**
         * UI 的预制体路径
         * @param prefabUrl 可根据情况使用不同的资源路径 
         * @param bundle 
         * @returns 
        */
        prefabUrl: (prefabUrl: string, bundle?: string) => any
    }
    namespace xt {
        type Constructor<T> = new (...args: any[]) => T;
        type AssetOnProgress = (finished: number, total: number, item: AssetManager.RequestItem) => void;
        type AssetOnFinish<T> = (asset: T) => void;
        type AssetsOnFinish<T> = (asset: T[]) => void;

        type BundleOnProgress = (finished: number, total: number) => void;
        type BundleOnFinish = () => void;

        type EventHandler = (...args: any[]) => any;
    }
}

export { }