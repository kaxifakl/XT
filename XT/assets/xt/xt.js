let _xt = {};
_xt['util'] = _xt['util'] || {};
_xt['config'] = _xt['config'] || {};
_xt['enum'] = _xt['enum'] || {};
_xt['game'] = _xt['game'] || {};
_xt['ui'] = _xt['ui'] || {};
_xt['data'] = _xt['data'] || {};
window['xt'] = window['xt'] || _xt;

function prefabUrl(prefabUrl, bundle) {
    return (target) => {
        target.__$prefabUrl = prefabUrl;
        target.__$bundle = bundle;
    };
}

_xt.prefabUrl = prefabUrl;