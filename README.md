# shortcode-tree
A node.js parser library for reading shortcodes.

[![npm](https://img.shields.io/npm/v/shortcode-tree.svg)](https://www.npmjs.com/package/shortcode-tree)
[![Build Status](https://travis-ci.org/roydejong/shortcode-tree.svg?branch=master)](https://travis-ci.org/roydejong/shortcode-tree)

## Introduction
`shortcode-tree` offers generic parsing functionality for text containing short codes (also known as bb codes).

This library does not convert short codes to HTML (like many other libraries do), but **it converts generic shortcode/HTML input to pure JavaScript objects**.

No set up is required, and you do not need to pre-define a list of shortcodes.

Example:

    ShortcodeParser.parseShortcode('[image id=123 src="bla.jpg" align="center"/]');
    
    // Shortcode {
    //     name: 'image',
    //     content: null,
    //     properties: { id: '123', src: 'bla.jpg', align: 'center' },
    //     isSelfClosing: true,
    //     codeText: '[image id=123 src="bla.jpg" align="center"/]',
    //     offset: 0 }

## Features

- Parse sets of mixed shortcodes and text/HTML into a tree structure
- Parse individual shortcode fragments
- Supports self-closing tags
- Supports tag properties (with or without string literals)
- Stringify `Shortcode` objects to shortcode text

## Installation

Installation with `npm`:

    npm install shortcode-tree --save
    
## Usage

Start with the raw text you want to process, and feed it to the `parse` function:

    var ShortcodeTree = require('shortcode-tree').ShortcodeTree;
    
    var rootNode = ShortcodeTree.parse(inputText);
    console.log(rootNode.children.length);
    
This function will return a `ShortcodeNode` object. Each `ShortcodeNode` may contain a set of child nodes.

If you have regular text or HTML mixed in at the same level as a shortcode, a `ShortcodeNode` may also contain `TextNode` children to hold these items. Text nodes themselves cannot hold children, only text.

### The `ShortcodeNode` object

A shortcode node contains the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `text` | string | The raw text content (code) of this node. |
| `shortcode` | `Shortcode` or null | Information about the parsed Shortcode represented by this node. Will be `null` if this is the root node. |
| `children` | array | List of children. May contain `ShortcodeNode` and `TextNode` items. |

### The `Shortcode` object

A parsed shortcode. Typically available through the `shortcode` field of a shortcode node.

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Tag name |
| `properties` | object | Key/value object with property values indexed by their name |
| `content` | string or null | The raw, unparsed content of the tag. May contain HTML and other short codes. `NULL` for self-closing tags. |
| `isSelfClosing` | bool | Indicates whether this is a self-closing tag without any content. |
| `codeText` | string | The raw shortcode text, as it was parsed. |
| `offset` | integer | Offset index, relative to the original input string. |

#### Methods

| Signature | Returns | Description |
| --- | --- | --- |
| `stringify()` | string | Formats the data in the `Shortcode` object to shortcode text |
| `hasProperty([string] key)` | boolean | Gets whether property with name `key` exists. |
| `getProperty([string] key)` | value or null | Gets value of property with name `key`, or NULL if not set. |
| `setProperty([string] key, value)` | void | Add or update property with given key and value. |
| `addChild([Shortcode] shortcode)` | void | Append a `shortcode` item to this shortcode's content using stringify. |
| `appendContent([string] content)` | void | Append content to the existing content. |  

### The `TextNode` object

A piece of raw text or HTML that was placed on the same level as another shortcode. This is always a child of a shortcode node.

| Field | Type | Description |
| --- | --- | --- |
| `text` | string | Raw text or code |

### Dumping tree structure

By calling `traceTree()` on a node, you can dump a simple visualisation of the parsed tree structure.

    var sampleInput =
        "[row]" +
            "[col]" +
                "<h1>My article</h1>" +
                "[img src=\"image.jpg\"/]" +
            "[/col]" +
            "[col]" +
                "<p>Just a boring text sample column</p>" +
            "[/col]" +
        "[/row]"

    var rootNode = ShortcodeTree.parse(sampleInput);
    rootNode.traceTree();
    
The above example would generate the following console output:

    +++++ Root Node +++++
    [Shortcode Node: row], content: [col]<h1>My article</h1>[img src="image.jpg"/][/col][col]<p>Just a boring text sample column</p>[/col]
    --- [Shortcode Node: col], content: <h1>My article</h1>[img src="image.jpg"/]
    ------ [Text Node], content: <h1>My article</h1>
    ------ [Shortcode Node: img], content: null
    --- [Shortcode Node: col], content: <p>Just a boring text sample column</p>


## Advanced usage

### Parsing a single short code fragment

To parse **one** individual short code, use the `ShortcodeParser`:

    var parser = require('shortcode-tree').ShortcodeParser;
    
    var shortcode = parser.parseShortcode("[b]example content[/b]");
    console.log(shortcode.content); // example content
    
The `parseShortcode` method returns a `Shortcode` object.

### Custom parser options

When calling `parseShortcode`, you can add an `options` object as a second argument.

    parser.parseShortcode("[b]example content[/b]", { /** insert options **/ })

The following options are available:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | string | `normal` | Parser mode to operate in. See table below. |
| `offset` | integer | `0` | Offset from the start of the input string, where parsing should begin. |
| `throwErrors` | boolean | `true` | If enabled: On shortcode parse error, an `Error` is thrown. If disabled: `false` is returned on parse error. |
| `precise` | boolean | `false` | If things aren't working as expected, enable this for deep recursive parsing. Reduces performance exponentially. |
| `selfClosingTags` | array | `[]` | You can specify a list of tags that should always be treated as self-closing. Needed when they don't use the "[selfcloser/]" syntax. |    

The default options are defined in `ShortcodeParser.DEFAULT_OPTIONS`.

#### Parser modes

| Constant | Value | Description |
| --- | --- | --- |
| `MODE_NORMAL` | `normal` | Parses text into a `Shortcode` object. |
| `MODE_GET_OPENING_TAG_NAME` | `tag_name` | Halts parsing once the tag name is found, and returns it as a string. |

### Extracting one level of shortcodes from text  

The `ShortcodeExtractor` is a component that can extract a set of Shortcodes from a single piece of text, without traversing deeper than one level.

    var extractor = require('shortcode-tree').ShortcodeExtractor;
    
    var shortcodes = extractor.extractShortcodes("Hey, [b]bold[/b] and [i]beautiful[/i].");
    console.log(shortcodes);
    
    // [ Shortcode {
    //     name: 'b',
    //     content: 'bold',
    //     properties: {},
    //     isSelfClosing: false,
    //     codeText: '[b]bold[/b]',
    //     offset: 5 },
    //   Shortcode {
    //     name: 'i',
    //     content: 'beautiful',
    //     properties: {},
    //     isSelfClosing: false,
    //     codeText: '[i]beautiful[/i]',
    //     offset: 21 } ]

The `extractShortcodes` method returns an array of `Shortcode` objects. 