# [ExTools](https://github.com/luuhai48/extools)
> Extra Javascript Tools for your website
> Quick & Easy
---
## Tools included:
    - TagInput
    - Modal
    - Clone
    - AutoComplete
    - DatePicker
    - Calculator
    - Upload
---
## Installation
Simply include it as a `<script>` tag from CDN.
```html
<script src="https://unpkg.com/extools@1.0.0/extools.js"></script>
```
Or
```javascript
//Choose
npm install extools
//Or
yarn add extools
//Then
const extools = require("extools");
```
And don't forget `css`
```html
<link rel="stylesheet" href="https://unpkg.com/extools@1.0.0/extools.css">
```

---
## Documentation & Example
#### TagInput
##### [See example](https://luuhai48.github.io/extools/example/taginput.html)
First, create a blank `Container` for the tool
```html
<div class="container1"></div>
```
Then, call the tool with the `script`
```javascript
var t = new extools({ 
    container: ".container1", 
    tool: "taginput", 
    name: "taginput", 
    data: ["tag1", "tag", "tag3"],
    attributes: [{ el: ".input", name: "placeholder", value: "Enter a tag..." }]
});
```
|Attribute|Required|Uses|
|---------|:------:|---|
|container|yes|Defines container element for the tool|
|tool|yes|Select the tool. Tools list [here](#tools-included)|
|name|no|Name attribute for the hidden Input|
|data|no|`JSON array`. The tags will shown on load|
|attributes|no|`JSON array`. Set custom attribute for an element inside container|
#### Modal
##### [See example](https://luuhai48.github.io/extools/example/modal.html)
First, create a `Container` for the tool
```html
<div class="container2">
    <button data-action="show">Show content</button>
    <div class="et--modal--hidden" data-target="hidden">
        You can put anything you want inside this `<div>`
    </div>
</div>
```
You can customize anything, except for the attribute `data-action` and `data-target`.
Then, call the tool with the `script`
```javascript
var t = new extools({ 
    container: ".container2", 
    tool: "modal",
    attributes: [{ el: "#select-element-inside-container", name: "custom-attribute-name", value: "attribute-value" }]
});
```
|Attribute|Required|Uses|
|---------|:------:|---|
|container|yes|Defines container element for the tool|
|tool|yes|Select the tool. Tools list [here](#tools-included)|
|attributes|no|`JSON array`. Set custom attribute for an element inside the container|

#### AutoComplete
##### [See example](https://luuhai48.github.io/extools/example/autocomplete.html)
First, create a `Container` for the tool
```html
<div class="container3"></div>
```
Then, call the tool with the `script`
```javascript
var t = new extools({ 
    container: ".container3", 
    tool: "autocomplete",
    data: ["John", "Jenny", "Jack", "Harry"],
    name: "autocomplete",
    highlight: "#color-code",
    attributes: [{ el: ".input", name: "placeholder", value: "Type to search..." }]
});
```
|Attribute|Required|Uses|
|---------|:------:|---|
|container|yes|Defines container element for the tool|
|tool|yes|Select the tool. Tools list [here](#tools-included)|
|data|yes|`JSON array`. Contains all data to queried from|
|name|no|Name attribute for the Input|
|highlight|no|Color code for highlighting the text|
|attributes|no|`JSON array`. Set custom attribute for an element inside the container|

#### Clone
##### [See example](https://luuhai48.github.io/extools/example/clone.html)
First, create a `Container` for the tool
```html
<div class="container4">
    <div data-target="bucket" class="panel">
        <div class="panel-block" data-target="source">
            <span>Email:</span>
            <input type="email" class="input" name="emails[]" placeholder="example@gmail.com">
            <span class="button is-danger" data-action="remove"><span class="icon"><i class="far fa-trash-alt"></i></span></span>
        </div>
    </div>
    <button type="button" class="button is-dark" data-action="clone">Clone</button>
</div>
```
You can customize anything, except for the attribute `data-action` and `data-target`.
Then, call the tool with the `script`
```javascript
var t = new extools({ 
    container: ".container4", 
    tool: "clone",
    attributes: [{ el: "#select-element-inside-container", name: "custom-attribute-name", value: "attribute-value" }]
});
```
|Attribute|Required|Uses|
|---------|:------:|---|
|container|yes|Defines container element for the tool|
|tool|yes|Select the tool. Tools list [here](#tools-included)|
|attributes|no|`JSON array`. Set custom attribute for an element inside the container|

#### DatePicker
##### [See example](https://luuhai48.github.io/extools/example/datepicker.html)
First, create a `Container` for the tool
```html
<div class="container5"></div>
```
Then, call the tool with the `script`
```javascript
var t = new extools({ 
    container: ".container5", 
    tool: "datepicker",
    name: "datepicker",
    date: "2019-04-19",
    attributes: [{ el: "#select-element-inside-container", name: "custom-attribute-name", value: "attribute-value" }]
});
```
|Attribute|Required|Uses|
|---------|:------:|---|
|container|yes|Defines container element for the tool|
|tool|yes|Select the tool. Tools list [here](#tools-included)|
|name|no|Name attribute for the hidden Input|
|date|no|`yyyy-mm-dd`. The date selected on start|
|attributes|no|`JSON array`. Set custom attribute for an element inside the container|

#### Calculator
##### [See example](https://luuhai48.github.io/extools/example/calculator.html)
First, create a `Container` for the tool
```html
<div class="container6"></div>
```
Then, call the tool with the `script`
```javascript
var t = new extools({ 
    container: ".container6", 
    tool: "calculator",
    name: "datepicker",
    attributes: [{ el: "#select-element-inside-container", name: "custom-attribute-name", value: "attribute-value" }]
});
```
|Attribute|Required|Uses|
|---------|:------:|---|
|container|yes|Defines container element for the tool|
|tool|yes|Select the tool. Tools list [here](#tools-included)|
|name|no|Name attribute for the hidden Input|
|attributes|no|`JSON array`. Set custom attribute for an element inside the container|

#### Upload
##### [See example](https://luuhai48.github.io/extools/example/upload.html)
First, create a `Container` for the tool
```html
<div class="container7"></div>
```
Then, call the tool with the `script`
```javascript
var t = new extools({ 
    container: ".container7", 
    tool: "upload",
    name: "upload",
    multiple: true,
    directory: true,
    onChange: function(e) {
        //callback function for input
        console.log(e.target.files);
    },
    attributes: [{ el: "#select-element-inside-container", name: "custom-attribute-name", value: "attribute-value" }]
});
```
|Attribute|Required|Uses|
|---------|:------:|---|
|container|yes|Defines container element for the tool|
|tool|yes|Select the tool. Tools list [here](#tools-included)|
|name|no|Name attribute for the file Input|
|multiple|no|Allow select multiple Files at once|
|directory|no|Allow select Folder|
|onChange|no|`Callback` function for the File input onchange|
|attributes|no|`JSON array`. Set custom attribute for an element inside the container|