class HttpManager {
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
        if (param && param.head) {
            for (let key in param.head) {
                xhr.setRequestHeader(key.toString(), param.head[key]);
            }
        }
        xhr.timeout = 10000;
        xhr.send();
    }

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
        if (param && param.head) {
            for (let key in param.head) {
                xhr.setRequestHeader(key.toString(), param.head[key]);
            }
        }
        xhr.timeout = 10000;
        xhr.send(data);
    }
}

declare global {
    interface IXT {
        httpManager: HttpManager
    }
    namespace xt {
        interface IHttpParam {
            succCall?: (data: any) => void;
            failCall?: () => void;
            head?: any;
            responseType?: XMLHttpRequestResponseType;
        }
    }
}

export { }

xt.httpManager = xt.httpManager || new HttpManager()