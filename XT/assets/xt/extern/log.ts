function log(...data: any[]) {
    console.log('%c xt ', 'color:white;background:blue;border-radius:9px 3px 9px 3px;font-weight:bold;font-style:italic', ...data)
}

function error(...data: any[]) {
    console.error('%c xt ', 'color:black;background:red;border-radius:9px 3px 9px 3px;font-weight:bold;font-style:italic', ...data)
}

function warn(...data: any[]) {
    console.warn('%c xt ', 'color:grey;background:yellow;border-radius:9px 3px 9px 3px;font-weight:bold;font-style:italic', ...data)
}

declare global {
    interface IXT {
        log: typeof log
        error: typeof error
        warn: typeof warn
    }
}

export { }

xt.log = xt.log || log;
xt.error = xt.error || error;
xt.warn = xt.warn || warn;
