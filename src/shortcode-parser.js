let fs = require('fs');
let util = require('util');
let Shortcode = require('./shortcode');

let ShortcodeParser = {
    parseShortcode(input) {
        if (!input.startsWith(ShortcodeParser.T_TAG_BLOCK_START) || !input.endsWith(ShortcodeParser.T_TAG_BLOCK_END)) {
            throw new Error('parseShortcode() expects a full shortcode, from opening tag to closing tag');
        }

        let shortcode = new Shortcode();

        // Step 1: Read the opening block without enclosing []'s
        let openBlockStartIdx = 0;
        let openBlockEndIdx = input.indexOf(ShortcodeParser.T_TAG_BLOCK_END);
        let openBlockTextFull = input.substr(openBlockStartIdx, openBlockEndIdx + 1);
        let openBlockText = openBlockTextFull.substr(1, openBlockTextFull.length - 2).trim();

        if (!openBlockText || !openBlockText.length) {
            throw new Error('Malformatted shortcode: Invalid or missing opening tag');
        }

        // Step 2: Determine if block is self closing or not
        let selfCloseIdx = openBlockText.lastIndexOf(ShortcodeParser.T_TAG_CLOSER);

        if (selfCloseIdx === openBlockEndIdx - 2) {
            // Last character before closing tag is the self-closing indicator
            // Mark shortcode as self closing, and remove the closer token from our buffer
            shortcode.isSelfClosing = true;
            openBlockText = openBlockText.substr(0, openBlockText.length - 1).trim();
        }

        // Step 3: Read the block's name and properties by tokenizing it
        let buffer = "";

        let readingName = true;
        let readingPropName = false;
        let readingPropVal = false;

        let properties = {};

        let currentPropKey = null;

        for (let index = 0; index <= openBlockText.length; index++) {
            let nextToken = openBlockText[index];
            let nothingLeft = (typeof nextToken === "undefined");

            if (readingName) {
                if (nothingLeft || nextToken === ShortcodeParser.T_TAG_PROPERTY_SEPARATOR) {
                    // We are finished reading the tag name, next is a property name or end of tag
                    shortcode.name = buffer;

                    buffer = "";

                    readingName = false;
                    readingPropName = true;
                    continue;
                }
            } else if (readingPropName) {
                if (nothingLeft || nextToken === ShortcodeParser.T_TAG_PROPERTY_SEPARATOR || nextToken === ShortcodeParser.T_TAG_PROPERTY_ASSIGN) {
                    // The tag or prop ends here (prop with no value), or a separator token was found to start the value
                    if (buffer.length) {
                        currentPropKey = buffer;
                        properties[currentPropKey] = null;

                        buffer = "";

                        readingPropName = false;
                        readingPropVal = true;
                    }

                    continue;
                }
            } else if (readingPropVal) {
                if (nothingLeft || nextToken === ShortcodeParser.T_TAG_PROPERTY_SEPARATOR) {
                    // The tag or value ends here, or the next property begins
                    if (buffer.length) {
                        properties[currentPropKey] = buffer;
                        currentPropKey = null;

                        buffer = "";

                        readingPropName = true;
                        readingPropVal = false;
                    }

                    continue;
                }
            }

            if (!nothingLeft) {
                buffer = buffer + nextToken;
            }
        }

        if (buffer.length > 0) {
            throw new Error('Malformatted shortcode: Invalid opening tag');
        }

        shortcode.properties = properties;

        // Step 4: If this is not a self closing tag; verify end tag is here as expected, and read the content
        let closingTagOffset = 0;

        if (!shortcode.isSelfClosing) {
            let closingTagExpected = `[/${shortcode.name}]`;

            if (input.lastIndexOf(closingTagExpected) !== input.length - closingTagExpected.length) {
                throw new Error(`Malformatted shortcode: Expected closing tag: ${closingTagExpected}`);
            }

            shortcode.content = input.substr(openBlockTextFull.length, (input.length - openBlockTextFull.length - closingTagExpected.length));
        } else {
            shortcode.content = null;
        }

        return shortcode;
    }
};

ShortcodeParser.T_TAG_BLOCK_START = "[";
ShortcodeParser.T_TAG_BLOCK_END = "]";
ShortcodeParser.T_TAG_CLOSER = "/";
ShortcodeParser.T_TAG_PROPERTY_ASSIGN = "=";
ShortcodeParser.T_TAG_PROPERTY_SEPARATOR = " ";
ShortcodeParser.T_TAG_PROPERTY_VALUE_WRAPPER = '"';
ShortcodeParser.T_TAG_PROPERTY_VALUE_ESCAPE = "\\";

module.exports = ShortcodeParser;
