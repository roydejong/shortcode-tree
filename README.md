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

### Extracting multiple shortcodes from text  

If there are multiple shortcodes within one piece of text, you can extract them using the `ShortcodeExtractor`:

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

This method will only extract shortcodes from one level, and does not process any child tags.

The `extractShortcodes` method returns an array of `Shortcode` objects.