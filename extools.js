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
        var self = this,
            defaults = {
                data: [],
                attributes: [],
            }
        self.options = {};
        ["data", "attributes", "name"].forEach(function (name) {
            self.options[name] = opts[name] || defaults[name];
        });
        self.container = document.querySelector(opts.container);
        if (!self.container) throw new Error("Error! Could not find Container element");
        if (self.container)
            switch (opts.tool) {
                case "taginput":
                    self._taginput();
                    break;
                case "datepicket":
                    break;
                case "autocomplete":
                    break;
                case "calculator":
                    break;
                case "modal":
                    self._modal();
                    break;
                default:
                    throw new Error("Error! No Tool selected!");
            }
        self._addAttributes();
    }

    extools.prototype = {
        constructor: extools,
        _taginput: function () {
            var self = this;
            self.container.innerHTML =
                `<div class="et--taginput--container">
                    <div class="control is-flex-1" data-target="insert">
                        <div class="control has-icon-left">
                            <input type="text" class="input">
                            <span class="icon is-left"><i class="fas fa-angle-double-right"></i></span>
                        </div>
                    </div>
                    <input type="text" class="hidden" data-target="value">
                </div>`;
            var input = self.container.querySelector("input"),
                value = self.container.querySelector('input[data-target="value"]'),
                insert = self.container.querySelector('[data-target="insert"]'),
                tags = [];

            if (self.options["name"])
                value.name = self.options["name"];
            input.addEventListener("input", function () {
                var entered = input.value.split(",");
                if (entered.length > 1) {
                    entered.forEach(function (t) {
                        let filtered = filter(t);
                        if (filtered.length > 0)
                            add(filtered);
                    });
                }
            });
            input.addEventListener("keydown", function (e) {
                if (e.code == "Enter")
                    add(input.value);
                if (e.code == "Backspace")
                    if (input.value.length == 0 && tags.length > 0)
                        remove(tags.length - 1);
            });

            if (self.options["data"]) {
                self.options["data"].forEach(function (t) {
                    if (filter(t).length > 0)
                        add(t);
                });
            }

            function add(text) {
                text = filter(text);
                if (text.length > 0)
                    if (!tags.find(x => x.text == text)) {
                        var tag = {
                            text: text,
                            el: document.createElement("span")
                        }
                        tag.el.classList.add("et--taginput--tag");
                        tag.el.innerHTML =
                            `<span>${text}</span>
                            <span class="delete" data-action="remove"><i class="fas fa-times-circle"></i></span>`;
                        tag.el.querySelector('[data-action="remove"]').onclick = () => { remove(tags.indexOf(tag)) }
                        tags.push(tag);
                        insert.parentNode.insertBefore(tag.el, insert);
                        refresh();
                    }
                input.value = "";
            }
            function remove(index) {
                var tag = tags[index];
                tags.splice(index, 1);
                insert.parentNode.removeChild(tag.el);
                refresh();
            }
            function refresh() {
                var list = [];
                tags.forEach(function (t) {
                    list.push(t.text);
                });
                value.value = list.join(",");
            }
            function filter(text) {
                return text.trim();
            }
        },
        _modal: function () {
            var self = this,
                button = self.container.querySelector('button[data-action="show"]'),
                hidden = self.container.querySelector('[data-target="hidden"]'),
                html = hidden.innerHTML;
            hidden.innerHTML =
                `<div class="et--modal--overlay"></div>
                <div class="et--modal--content">
                    ${html}
                </div>`;
            button.onclick = () => {
                hidden.classList.add("is-active");
            }
            hidden.querySelector(".et--modal--overlay").onclick = () => {
                hidden.classList.remove("is-active");
            }
        },
        _addAttributes: function () {
            this.options["attributes"].forEach(attr => {
                if (attr["el"])
                    var el = this.container.querySelector(attr["el"]);
                else
                    var el = this.container;
                if (el)
                    el.setAttribute(attr["name"], attr["value"]);
                else
                    throw new Error("Error! Can not find Attribute element!");
            })
        }
    }
    return extools;
}));