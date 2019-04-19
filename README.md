# [ExTools](https://luuhai48.github.io)
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/extools/0.0.1/extools.min.js"></script>
```
Or
```javascript
const extools = require("extools");
```
---
## Documentation
#### TagInput
First, create a blank container for the tool
```html
<div class="container"></div>
```
Then, call the tool with the script
```javascript
var t = new extools({ 
    container: ".container", 
    tool: "taginput", 
    name: "taginput", 
    data: ["tag1", "tag", "tag3"] 
});
```
|Attribute|Required|Uses|
|---------|:------:|---|
|container|yes|Defines container element for the tool|
|tool|yes|Select the tool.<br> Tools list [here](#tools-included)|
|name|no|Name for the hidden Input|
|data|no|`JSON array`. The tags will shown on load|
