# Shortcode parser library

## Introduction
**shortcode-tree** provides generic parsing functionality for text containing short codes (also known as bb codes).

This library does not convert short codes to HTML (like many others do), but **it converts generic shortcode/HTML input to pure JavaScript objects**.

No set up is required, and you do not need to pre-define a list of shortcodes.

Example:

    ShortcodeParser.parseShortcode('[image id=123 src="bla.jpg" align="center"/]');
    
Result:
    
    Shortcode {
         name: 'image',
         content: null,
         properties: { id: '123', src: 'bla.jpg', align: 'center' },
         isSelfClosing: true }

## Features

- Parse individual BB code tags
- Supports self-closing tags
- Supports tag properties, with or without string literals and escape characters

## Installation

Installation with `npm`:

    npm install shortcode-tree --save
    

## Usage

### Parsing a single short code

To parse an individual short code, use the `ShortcodeParser` class:

    let ShortcodeParser = require('shortcode-tree/shortcode-parser');
    
    let parsed = ShortcodeParser.parseShortcode("[b]example input[/b]");
    
The `parseShortcode` method returns a `Shortcode` object with the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `name` | string | Tag name |
| `properties` | object | Key/value object with property values indexed by their name |
| `content` | string or null | The raw, unparsed content of the tag. May contain HTML and other short codes. `NULL` for self-closing tags. |
| `isSelfClosing` | bool | Indicates whether this is a self-closing tag without any content. | 

    