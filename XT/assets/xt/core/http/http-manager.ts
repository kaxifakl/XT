class HttpManager {
    /**Get请求
     * @param url 地址
     * @param param 参数
     */
    public get(url: string, param?: xt.IHttpParam): void {
        let xhr = new XMLHttpRequest();
        xhr.responseType = param?.responseType || 'json';
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var response = xhr.response;
                    param?.succCall?.(response);
                } else {
                    param?.failCall?.();
                }
            }
        };

        xhr.onerror = function (err) {
            param?.failCall?.();
            xt.error(err);
        }

        xhr.ontimeout = function (err) {
            param?.failCall?.();
            xt.error(err);
        }

        xhr.open("GET", url, true);
        if (param && param.headers) {
            for (let key in param.headers) {
                xhr.setRequestHeader(key.toString(), param.headers[key]);
            }
        }
        xhr.timeout = 10000;
        xhr.send();
    }

    /**Post请求
     * @param url 地址
     * @param data 数据
     * @param param 参数
     */
    public post(url: string, data: any, param?: xt.IHttpParam) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = param?.responseType || 'json';
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var response = xhr.response;
                    param && param.succCall?.(response);
                } else {
                    param && param.failCall?.();
                }
            }
        };

        xhr.onerror = function (err) {
            param?.failCall?.();
            xt.error(err);
        }

        xhr.ontimeout = function (err) {
            param?.failCall?.();
            xt.error(err);
        }

        xhr.open("POST", url, true);
        if (param && param.headers) {
            for (let key in param.headers) {
                xhr.setRequestHeader(key.toString(), param.headers[key]);
            }
        }
        xhr.timeout = 10000;
        xhr.send(data);
    }
}

declare global {
    interface IXT {
        /**http请求管理类 */
        httpManager: HttpManager
    }
    namespace xt {
        interface IHttpParam {
            /**成功回调 */
            succCall?: (data: any) => void;
            /**失败回调 */
            failCall?: () => void;
            /**请求头 */
            headers?: any;
            /**数据响应格式 */
            responseType?: XMLHttpRequestResponseType;
        }
    }
}

export { }

xt.httpManager = xt.httpManager || new HttpManager()