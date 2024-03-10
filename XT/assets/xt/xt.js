let _xt = {
    util: {},
    config: {},
    enum: {},
    game: {},
    ui: {},
    data: {},
    decorator: {},
};
window['xt'] = window['xt'] || _xt;

function setPrefab(prefabUrl, bundle) {
    return (target) => {
        target.__$prefabUrl = prefabUrl;
        target.__$bundle = bundle;
    };
}

_xt.decorator.setPrefab = setPrefab;