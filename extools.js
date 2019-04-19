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
        ["data", "attributes", "name", "highlight", "date", "onChange", "multiple", "directory"].forEach(function (name) {
            self.options[name] = opts[name] || defaults[name];
        });
        self.container = document.querySelector(opts.container);
        if (!self.container) throw new Error("Error! Could not find Container element");
        if (self.container)
            switch (opts.tool.toLowerCase()) {
                case "taginput":
                    self._taginput();
                    break;
                case "datepicker":
                    self._datepicker();
                    break;
                case "autocomplete":
                    self._autocomplete();
                    break;
                case "calculator":
                    self._calculator();
                    break;
                case "modal":
                    self._modal();
                    break;
                case "clone":
                    self._clone();
                    break;
                case "upload":
                    self._upload();
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
                value = self.container.querySelector('[data-target="value"]'),
                insert = self.container.querySelector('[data-target="insert"]'),
                tags = [];

            if (self.options["name"])
                value.name = self.options["name"];
            input.addEventListener("input", function () {
                let entered = input.value.split(",");
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
                        let tag = {
                            text: text,
                            el: document.createElement("span")
                        }
                        tag.el.classList.add("et--taginput--tag");
                        tag.el.innerHTML =
                            `<span>${text}</span>
                            <span class="delete" data-action="remove"></span>`;
                        tag.el.querySelector('[data-action="remove"]').onclick = () => { remove(tags.indexOf(tag)) }
                        tags.push(tag);
                        insert.parentNode.insertBefore(tag.el, insert);
                        refresh();
                    }
                input.value = "";
            }
            function remove(index) {
                let tag = tags[index];
                tags.splice(index, 1);
                insert.parentNode.removeChild(tag.el);
                refresh();
            }
            function refresh() {
                let list = [];
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
                button = self.container.querySelector('[data-action="show"]'),
                hidden = self.container.querySelector('[data-target="hidden"]'),
                html = hidden.innerHTML;
            hidden.classList.add("et--modal--hidden");
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
        _clone: function () {
            var self = this,
                bucket = self.container.querySelector('[data-target="bucket"]'),
                source = self.container.querySelector('[data-target="source"]'),
                clone = self.container.querySelector('[data-action="clone"]'),
                remove = source.querySelector('[data-action="remove"]'),
                html = source.outerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/>( +)</g, "><");

            remove.onclick = () => { bucket.removeChild(remove.closest('[data-target="source"]')) }
            bucket.dataset.html = JSON.stringify(html);
            clone.onclick = () => {
                let item = self._createElementFromHtml(JSON.parse(bucket.dataset.html));
                let removeBtn = item.querySelector('[data-action="remove"]');
                removeBtn.onclick = () => { bucket.removeChild(removeBtn.closest('[data-target="source"]')) }
                bucket.appendChild(item);
            }
        },
        _autocomplete: function () {
            var self = this,
                currentFocus;
            self.container.innerHTML =
                `<div class="et--autocomplete" data-target="container">
                    <input type="text" class="input" data-target="input">
                </div>`;
            var container = self.container.querySelector('[data-target="container"]'),
                input = self.container.querySelector('[data-target="input"]');

            if (self.options.name)
                input.name = self.options.name;
            input.onfocus = autocomplete;
            input.oninput = autocomplete;
            input.onkeydown = function (e) {
                let x = self.container.querySelector(".et--autocomplete--list")
                if (x) x = x.querySelectorAll("div");
                if (e.keyCode == 40) {
                    currentFocus++;
                    addActive(x);
                } else if (e.keyCode == 38) {
                    currentFocus--;
                    addActive(x);
                } else if (e.keyCode == 13) {
                    e.preventDefault();
                    if (currentFocus > -1) {
                        if (x) x[currentFocus].click();
                    }
                }
            }
            function autocomplete(e) {
                var a, b, val = this.value;
                closeAllLists();
                if (!val) { return false; }
                currentFocus = -1;

                a = document.createElement("div");
                a.classList.add("et--autocomplete--list");

                self.options["data"].filter(x => { return x.toUpperCase().includes(val.toUpperCase()) }).forEach(item => {
                    b = document.createElement("div");
                    let find = item.substr(item.toUpperCase().indexOf(val.toUpperCase()), val.length);
                    b.innerHTML = !self.options["highlight"] ? item.replace(new RegExp(find.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'g'), `<b>${find}</b>`) : item.replace(new RegExp(find.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'g'), `<span style="background-color: ${self.options["highlight"]}">${find}</span>`);
                    b.dataset.value = item;
                    b.onclick = function () {
                        input.value = this.dataset.value;
                        closeAllLists();
                    }
                    a.appendChild(b);
                })
                container.appendChild(a);
            }
            function addActive(x) {
                if (!x) return false;
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                x[currentFocus].classList.add("is-active");
            }
            function removeActive(x) {
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("is-active");
                }
            }
            function closeAllLists(elmnt) {
                let x = self.container.querySelector(".et--autocomplete--list");
                if (elmnt != x && elmnt != input) {
                    if (x) x.parentNode.removeChild(x);
                }
            }
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        },
        _datepicker: function () {
            const helpers = {
                firstDayOfWeek: 1, //Monday
                toISOFormatedString(date) {
                    return `${date.getFullYear()}-${
                        date.getMonth() + 1 < 10
                            ? "0" + (date.getMonth() + 1)
                            : date.getMonth() + 1}-${
                        date.getDate() < 10
                            ? "0" + date.getDate()
                            : date.getDate()}`;
                },
                toLocaleDateString(date) {
                    return `${
                        date.getDate() < 10
                            ? "0" + date.getDate()
                            : date.getDate()}/${
                        date.getMonth() + 1 < 10
                            ? "0" + (date.getMonth() + 1)
                            : date.getMonth() + 1
                        }/${date.getFullYear()}`;
                },
                HTMLMonthOptions: (month = false) => {
                    if (!month)
                        month = new Date().getMonth() + 1;
                    let html = "";
                    for (let i = 1; i < month; i++)
                        html += `<option value="${i}">Tháng ${i}</option>`;
                    html += `<option value="${month}" selected="selected">Tháng ${month}</option>`;
                    for (let i = month + 1; i <= 12; i++)
                        html += `<option value="${i}">Tháng ${i}</option>`;
                    return html;
                },
                HTMLYearOptions: (year = false) => {
                    if (!year)
                        year = (new Date).getFullYear();
                    let html = "";
                    for (let i = year + 10; i > year; i--)
                        html += `<option value="${i}">${i}</option>`;
                    html += `<option value="${year}" selected="selected">${year}</option>`
                    for (let i = 1; i <= 10; i++) {
                        html += `<option value="${year - i}">${year - i}</option>`
                    }
                    return html
                },
                weekBuilder(startingDate, month, year) {
                    const thisMonth = new Date(year, month)
                    const thisWeek = []
                    const dayOfWeek = new Date(year, month, startingDate).getDay()
                    const end =
                        dayOfWeek >= this.firstDayOfWeek
                            ? dayOfWeek - this.firstDayOfWeek
                            : 7 - this.firstDayOfWeek + dayOfWeek
                    let daysAgo = 1
                    for (let i = 0; i < end; i++) {
                        thisWeek.unshift(
                            new Date(
                                thisMonth.getFullYear(),
                                thisMonth.getMonth(),
                                startingDate - daysAgo
                            )
                        )
                        daysAgo++
                    }
                    thisWeek.push(new Date(year, month, startingDate))
                    let daysForward = 1
                    while (thisWeek.length < 7) {
                        thisWeek.push(new Date(year, month, startingDate + daysForward))
                        daysForward++
                    }
                    return thisWeek
                },
                weeksInThisMonth(year, month) {
                    const daysInThisMonth = new Date(year, month + 1, 0).getDate()
                    let weeksInThisMonth = [],
                        startingDay = 1
                    while (startingDay <= daysInThisMonth + 6) {
                        const newWeek = this.weekBuilder(startingDay, month, year)
                        let weekValid = false
                        for (let day of newWeek) {
                            if (day.getMonth() === month) {
                                weekValid = true
                                break
                            }
                        }
                        if (weekValid) {
                            weeksInThisMonth.push(newWeek)
                        }
                        startingDay += 7
                    }
                    return weeksInThisMonth
                }
            }
            var self = this,
                currentDate,
                currentMonth,
                currentYear,
                previousDate;
            self.container.classList.add("et--datepicker");
            self.container.innerHTML =
                `<input class="input" data-target="input">
                <div class="et--datepicker--calendar">
                    <div class="et--datepicker--header">
                        <a class="button previous-month" data-action="previous"><span class="icon"><i class="fas fa-chevron-left"></i></span></a>
                        <div class="month-year-picker">
                            <div class="select">
                                <select data-target="month"></select>
                            </div>
                            <div class="select">
                                <select data-target="year"></select>
                            </div>
                        </div>
                        <a class="button next-month" data-action="next"><span class="icon"><i class="fas fa-chevron-right"></i></span></a>
                    </div>
                    <div class="et--datepicker--table">
                        <div class="weeks">
                            <div class="day">T2</div>
                            <div class="day">T3</div>
                            <div class="day">T4</div>
                            <div class="day">T5</div>
                            <div class="day">T6</div>
                            <div class="day">T7</div>
                            <div class="day is-weekend">CN</div>
                        </div>
                        <div class="calendar" data-target="calendar"></div>
                    </div>
                </div>
                <div class="et--datepicker--overlay" data-target="overlay"></div>
                <input class="hidden" data-target="value">`;
            var input = self.container.querySelector('input[data-target="input"]'),
                value = self.container.querySelector('input[data-target="value"]'),
                overlay = self.container.querySelector('[data-target="overlay"]'),
                monthSelect = self.container.querySelector('[data-target="month"]'),
                yearSelect = self.container.querySelector('[data-target="year"]'),
                calendar = self.container.querySelector('[data-target="calendar"]'),
                prevBtn = self.container.querySelector('[data-action="previous"]'),
                nextBtn = self.container.querySelector('[data-action="next"]');

            if (self.options["date"]) {
                input.value = helpers.toLocaleDateString(new Date(self.options["date"]));
            }
            monthSelect.innerHTML = helpers.HTMLMonthOptions(currentMonth);
            yearSelect.innerHTML = helpers.HTMLYearOptions(currentYear);

            if (input.value)
                save(input.value);
            else {
                currentDate = (new Date).getDate();
                currentMonth = (new Date).getMonth() + 1;
                currentYear = (new Date).getFullYear();
            }
            if (self.options["name"])
                value.name = self.options["name"];

            overlay.onclick = () => {
                end();
            }
            input.onfocus = () => {
                self.container.classList.add("is-active");
            }
            input.oninput = function () {
                this.type = 'text';
                var inp = this.value;
                if (/\D\/$/.test(inp)) inp = inp.substr(0, inp.length - 3);
                var values = inp.split('/').map(function (v) {
                    return v.replace(/\D/g, '')
                });
                if (values[0]) values[0] = checkValue(values[0], 31);
                if (values[1]) values[1] = checkValue(values[1], 12);
                var output = values.map(function (v, i) {
                    return v.length == 2 && i < 2 ? v + '/' : v;
                });
                this.value = output.join('').substr(0, 14);

                if (this.value.split("/").length === 3) {
                    let d = this.value.split("/")[0],
                        m = this.value.split("/")[1],
                        y = this.value.split("/")[2];
                    if (new Date(`${m}-${d}-${y}`) != "Invalid Date") {
                        let inputDate = new Date(`${m}-${d}-${y}`);
                        currentDate = inputDate.getDate();
                        currentMonth = inputDate.getMonth() + 1;
                        currentYear = inputDate.getFullYear();
                        updateCalendar();
                    }
                }
            }
            input.onblur = function () {
                this.type = 'text';
                var inp = this.value;
                var values = inp.split('/').map(function (v, i) {
                    return v.replace(/\D/g, '')
                });
                var output = '';

                if (values.length == 3) {
                    var year = values[2].length !== 4 ? parseInt(values[2]) + 2000 : parseInt(values[2]);
                    var month = parseInt(values[0]) - 1;
                    var day = parseInt(values[1]);
                    var d = new Date(year, month, day);
                    if (!isNaN(d)) {
                        var dates = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
                        output = dates.map(function (v) {
                            v = v.toString();
                            return v.length == 1 ? '0' + v : v;
                        }).join('/');
                    };
                };
                this.value = output;
            }
            monthSelect.onchange = () => {
                currentMonth = parseInt(monthSelect.value);
                updateCalendar();
            }
            yearSelect.onchange = () => {
                currentYear = parseInt(yearSelect.value);
                updateCalendar();
            }
            prevBtn.onclick = () => {
                changeMonth(-1);
            }
            nextBtn.onclick = () => {
                changeMonth(1);
            }

            updateCalendar();

            function save(formatedDateString) {
                let splitted = formatedDateString.split("/");
                const formatedDate = new Date(`${splitted[1]}-${splitted[0]}-${splitted[2]}`);
                if (formatedDate == "Invalid Date")
                    return false;
                currentDate = formatedDate.getDate();
                currentMonth = formatedDate.getMonth() + 1;
                currentYear = formatedDate.getFullYear();
                input.value = formatedDateString;
                previousDate = helpers.toISOFormatedString(formatedDate);
                value.value = previousDate;
            }
            function makeCalendar() {
                const weeks = helpers.weeksInThisMonth(currentYear, currentMonth - 1);
                const today = helpers.toISOFormatedString(new Date());
                let generatedHTML = [];
                for (let week of weeks) {
                    let rowEl = `<div class="week">`;
                    for (let day of week) {
                        let thisDate = helpers.toISOFormatedString(day),
                            isToday = thisDate === today,
                            isSelected = thisDate === previousDate,
                            isSunday = day.getDay() === 0,
                            isThisMonth = day.getMonth() === (currentMonth - 1),
                            className = "day";
                        if (isToday)
                            className += " is-today";
                        if (isSelected)
                            className += " is-selected";
                        if (!isThisMonth)
                            className += " is-unselectable";
                        if (isSunday)
                            className += " is-weekend";
                        let dayEl = `<span class="${className}" data-date="${thisDate}" ${
                            isThisMonth ? 'data-action="pickDate"' : ''
                            }>${day.getDate()}</span>`;
                        rowEl += dayEl;
                    }
                    rowEl += "</div>";
                    generatedHTML.push(rowEl);
                }
                return generatedHTML.join("\n");
            }
            function updateEvents() {
                var dates = calendar.querySelectorAll('[data-action="pickDate"]');
                dates.forEach(date => {
                    date.onclick = pickDate;
                })
            }
            function updateCalendar() {
                monthSelect.innerHTML = helpers.HTMLMonthOptions(currentMonth);
                yearSelect.innerHTML = helpers.HTMLYearOptions(currentYear);
                calendar.innerHTML = makeCalendar();
                updateEvents();
            }
            function changeMonth(change) {
                let newMonth = currentMonth + change,
                    newYear = currentYear;
                if (newMonth === 0) {
                    newMonth = 12;
                    newYear--;
                } else if (newMonth == 13) {
                    newMonth = 1;
                    newYear++;
                }
                currentMonth = newMonth;
                currentYear = newYear;
                updateCalendar();
            }
            function pickDate(event) {
                calendar.querySelectorAll(".day").forEach(day => { day.classList.remove("is-selected") });
                event.target.closest(".day").classList.add("is-selected");

                input.value = helpers.toLocaleDateString(new Date(event.target.dataset.date));
                value.value = event.target.dataset.date;
                previousDate = event.target.dataset.date;
                end();
            }
            function end() {
                self.container.classList.remove("is-active");
                input.blur();
            }
            function checkValue(str, max) {
                if (str.charAt(0) !== '0' || str == '00') {
                    var num = parseInt(str);
                    if (isNaN(num) || num <= 0 || num > max) num = 1;
                    str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
                };
                return str;
            }
        },
        _calculator: function () {
            var self = this;
            self.container.classList.add("et--calculator");
            self.container.innerHTML =
                `<div class="et--calculator--input" data-target="output"></div>
                <div">
                  <div class="et--calculator--operators">
                    <div>+</div>
                    <div>-</div>
                    <div>&times;</div>
                    <div>&divide;</div>
                  </div>
                  <div class="et--calculator--leftPanel">
                    <div class="et--calculator--numbers">
                      <div>7</div>
                      <div>8</div>
                      <div>9</div>
                    </div>
                    <div class="et--calculator--numbers">
                      <div>4</div>
                      <div>5</div>
                      <div>6</div>
                    </div>
                    <div class="et--calculator--numbers">
                      <div>1</div>
                      <div>2</div>
                      <div>3</div>
                    </div>
                    <div class="et--calculator--numbers">
                      <div>0</div>
                      <div>.</div>
                      <div data-action="clear">C</div>
                    </div>
                  </div>
                  <div class="et--calculator--equal" data-action="result">=</div>
                  <input type="hidden" data-target="value">
                </div>`;
            var numbers = self.container.querySelectorAll(".et--calculator--numbers div"),
                buttons = self.container.querySelectorAll(".et--calculator--operators div"),
                resultBtn = self.container.querySelector('[data-action="result"]'),
                output = self.container.querySelector('[data-target="output"]'),
                value = self.container.querySelector('[data-target="value"]'),
                formula = "";
            if (self.options.name)
                value.name = self.options.name;
            numbers.forEach(number => {
                if (number.textContent == "C") {
                    number.onclick = () => {
                        formula = "";
                        output.textContent = "";
                    }
                } else
                    number.onclick = () => {
                        formula += number.textContent;
                        output.textContent = formula;
                    }
            });
            buttons.forEach(btn => {
                btn.onclick = () => {
                    formula += btn.textContent;
                    output.textContent = formula;
                }
            });
            resultBtn.onclick = () => {
                calculate();
            }
            function calculate() {
                try {
                    formula = Math.round(eval(formula.replace(/×/g, "*").replace(/÷/g, "/")) * 100) / 100;
                    output.textContent = formula;
                    value.value = formula;
                }
                catch (error) { };
            }
        },
        _upload: function () {
            var self = this;
            self.container.innerHTML =
                `<div class="et--upload" data-target="zone">
                    <div class="file">
                        <label class="file-label">
                        <input class="file-input" type="file" ${ self.options.multiple === true ? "multiple" : ""} data-target="files">
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">
                                Choose a file…
                            </span>
                        </span>
                        </label>
                    </div>
                </div>`;
            var input = self.container.querySelector('input[data-target="files"]'),
                dropzone = self.container.querySelector('[data-target="zone"]');
            if (self.options.name)
                input.name = self.options.name;
            if (self.options.directory === true)
                input.webkitdirectory = true;
            dropzone.ondragover = (e) => {
                e.preventDefault();
                dropzone.classList.add("dragover");
            }
            dropzone.ondragleave = (e) => {
                e.preventDefault();
                dropzone.classList.remove("dragover");
            }
            dropzone.ondrop = (e) => {
                let items = event.dataTransfer.items;
                e.preventDefault();
                dropzone.classList.remove("dragover");
                for (let i = 0; i < items.length; i++) {
                    let item = items[i].webkitGetAsEntry();
                    if (item) {
                        scanFiles(item);
                    }
                }
            }
            function scanFiles(item) {
                console.log(item.name)
                if (item.isDirectory) {
                    let directoryReader = item.createReader();
                    directoryReader.readEntries(function (entries) {
                        entries.forEach(function (entry) {
                            scanFiles(entry);
                        });
                    });
                }
            }
            input.onchange = self.options.onChange;
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
        },
        _createElementFromHtml: function (htmlString) {
            let div = document.createElement('div');
            div.innerHTML = htmlString;
            return div.firstChild;
        }
    }
    return extools;
}));