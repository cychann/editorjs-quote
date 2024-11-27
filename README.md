# EditorJS Quote Block

Provides customizable Quote Blocks with multiple styles for Editor.js.

## Installation

Get the package:

```bash
yarn add @cychann/editorjs-quote
```

Include module in your application:

```javascript
import Quote from "@cychann/editorjs-quote";
```

## Usage

Add a new Tool to the tools property of the Editor.js initial config.

```javascript
const editor = new EditorJS({
  tools: {
    quote: Quote,
  },
});
```
