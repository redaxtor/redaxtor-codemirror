# Redaxtor-codemirror
Redaxtor-codemirror is a source-editor plugin for Redaxtor library

## The Gist (with Redaxtor)
```js
var Redaxtor = require('redaxtor');
var RedaxtorCodemirror = require('redaxtor-codemirror');
require('codemirror/mode/htmlmixed/htmlmixed')

var components = {
    html: RedaxtorCodemirror
}

let redaxtor = new Redaxtor({
    pieces: {
        components: components
    }
});
```
