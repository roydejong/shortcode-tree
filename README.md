# shortcode-tree
A node.js parser library for reading shortcodes.

[![npm](https://img.shields.io/npm/v/github.svg)](https://www.npmjs.com/package/shortcode-tree)
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

- Parse individual BB code tags
- Supports self-closing tags
- Supports tag properties, with or without string literals and escape characters

## Installation

Installation with `npm`:

    npm install shortcode-tree --save
    

## Usage

### Parsing a single short code

To parse **one** individual short code, use the `ShortcodeParser`:

    var parser = require('shortcode-tree').ShortcodeParser;
    
    var shortcode = parser.parseShortcode("[b]example content[/b]");
    console.log(shortcode.content); // example content
    
The `parseShortcode` method returns a `Shortcode` object.

### The `Shortcode` object

| Property | Type | Description |
| --- | --- | --- |
| `name` | string | Tag name |
| `properties` | object | Key/value object with property values indexed by their name |
| `content` | string or null | The raw, unparsed content of the tag. May contain HTML and other short codes. `NULL` for self-closing tags. |
| `isSelfClosing` | bool | Indicates whether this is a self-closing tag without any content. |
| `codeText` | string | The raw shortcode text, as it was parsed. |
| `offset` | integer | Offset index, relative to the original input string. |

## Advanced usage

### Custom parser options

When calling `parseShortcode`, you can add an options object as a second argument.

    parser.parseShortcode("[b]example content[/b]", { /** insert options **/ })

The following options are available:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | string | `normal` | Parser mode to operate in. See table below. |
| `offset` | integer | `0` | Offset from the start of the input string, where parsing should begin. |
| `throwErrors` | boolean | `true` | If enabled: On shortcode parse error, an `Error` is thrown. If disabled: `false` is returned on parse error. |
| `precise` | boolean | `false` | If things aren't working as expected, enable this for deep recursive parsing. Reduces performance exponentially. |  

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