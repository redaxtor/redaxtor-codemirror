# DEPRECATED This project is deprecated in favor of [plugin-codemirror](https://github.com/writeaway/writeaway/tree/master/packages/plugin-codemirror)

## Redaxtor-codemirror
Redaxtor-codemirror is a source-editor plugin for Redaxtor library

## The Gist (with Redaxtor)
```js
var Redaxtor = require('redaxtor');
var RedaxtorCodemirror = require('redaxtor-codemirror');
require('style!css!codemirror/lib/codemirror.css');

var components = {
    source: RedaxtorCodemirror
}

let redaxtor = new Redaxtor({
    pieces: {
        components: components
    }
});
```
