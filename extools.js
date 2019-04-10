; (function (root, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else root['extools'] = definition();
}(this, function () {
    "use strict"
    function extools(opts) {
        if (!(this instanceof extools)) {
            return new extools(opts);
        }
        var self = this;
        var defaults = {
            data: [],
            readonly: false,
        }
        self.options = {};
        ["data", "readonly"].forEach(function (name) {
            self.options[name] = opts[name] || defaults[name];
        });
        self.container = document.querySelector(opts.container);
        if (!self.container) throw new Error("Error! Could not find Container element");
        if (self.container)
            switch (opts.tool) {
                case "taginput":
                    break;
                case "datepicket":
                    break;
                case "autocomplete":
                    break;
                case "calculator":
                    break;
                case "modal":
                    break;
                default:
                    throw new Error("Error! No Tool selected!");
            }
    }

    extools.prototype = {
        constructor: extools,

    }
    return extools;
}));