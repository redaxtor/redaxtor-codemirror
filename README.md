# Redaxtor-codemirror
Redaxtor-codemirror is a source-editor plugin for Redaxtor library

## The Gist (with Redaxtor)
```js
var Redaxtor = require('redaxtor');
var RedaxtorCodemirror = require('redaxtor-codemirror');

var components = {
    source: RedaxtorCodemirror
}

let redaxtor = new Redaxtor({
    pieces: {
        components: components
    }
});
```
