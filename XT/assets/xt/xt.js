let _xt = {
    util: {},
    config: {},
    enum: {},
    game: {},
    ui: {},
    data: {},
};
window['xt'] = window['xt'] || _xt;

function prefabUrl(prefabUrl, bundle) {
    return (target) => {
        target.__$prefabUrl = prefabUrl;
        target.__$bundle = bundle;
    };
}

_xt.prefabUrl = prefabUrl;