let Shortcode = require('./shortcode');

/**
 * Utility for formatting
 */
let ShortcodeFormatter = {
    /**
     * Converts a given shortcode to a string representation.
     *
     * @param {Shortcode} shortcode
     */
    stringify(shortcode, options) {
        if (!options) {
            options = ShortcodeFormatter.DEFAULT_OPTIONS;
        } else {
            options = Object.assign({}, ShortcodeFormatter.DEFAULT_OPTIONS, options);
        }

        let buffer = "";
        let tagNameToUse = shortcode.name;

        if (options.tagName) {
            tagNameToUse = options.tagName;
        } else if (typeof options.tagNameMap[tagNameToUse] !== "undefined") {
            tagNameToUse = options.tagNameMap[tagNameToUse];
        }

        // Open tag "[name"
        buffer += options.asHtml ? ShortcodeFormatter.T_TAG_START_HTML : ShortcodeFormatter.T_TAG_START;
        buffer += tagNameToUse;

        // Add any properties
        for (let key in shortcode.properties) {
            if (!shortcode.properties.hasOwnProperty(key)) {
                continue;
            }

            let valueRaw = (shortcode.properties[key]);
            let value = valueRaw ? valueRaw.toString().trim() : null;

            // Add property key
            buffer += ShortcodeFormatter.T_TAG_PROPERTY_SEPARATOR;
            buffer += key;

            if (value && value.length) {
                // Value is non empty
                buffer += ShortcodeFormatter.T_TAG_PROPERTY_ASSIGN;

                // Wrap in quotes as string literal if needed
                if (options.asHtml || this.getShouldValueBeLiteral(value)) {
                    buffer += ShortcodeFormatter.T_TAG_PROPERTY_VALUE_WRAPPER;
                    buffer += this.escapeValueForLiteral(value);
                    buffer += ShortcodeFormatter.T_TAG_PROPERTY_VALUE_WRAPPER;
                } else {
                    buffer += value;
                }
            } else {
                // Value is empty, that's fine too: leave out the assignment operator
            }
        }

        if (shortcode.isSelfClosing) {
            // Close tag as self-closing
            buffer += ShortcodeFormatter.T_TAG_CLOSER;
        }

        if (options.asHtml) {
            buffer += ShortcodeFormatter.T_TAG_END_HTML;
        } else {
            buffer += ShortcodeFormatter.T_TAG_END;
        }

        // Add raw content
        if (shortcode.content) {
            buffer += shortcode.content;
        }

        // Add close tag
        if (!shortcode.isSelfClosing) {
            if (options.asHtml) {
                buffer += ShortcodeFormatter.T_TAG_START_HTML;
                buffer += ShortcodeFormatter.T_TAG_CLOSER;
                buffer += tagNameToUse;
                buffer += ShortcodeFormatter.T_TAG_END_HTML;
            } else {
                buffer += ShortcodeFormatter.T_TAG_START;
                buffer += ShortcodeFormatter.T_TAG_CLOSER;
                buffer += tagNameToUse;
                buffer += ShortcodeFormatter.T_TAG_END;
            }
        }

        return buffer;
    },

    getShouldValueBeLiteral(strValue) {
        // If this is a single number, don't treat it as a literal
        let parsedNumber = parseInt(strValue);

        if (!isNaN(parsedNumber) && parsedNumber.toString() === strValue) {
            return false;
        }

        return true;
    },

    escapeValueForLiteral(strValue) {
        let fnReplaceAll = function(target, search, replacement) {
            return target.replace(new RegExp(search, 'g'), replacement);
        };

        strValue = fnReplaceAll(strValue, ShortcodeFormatter.T_TAG_PROPERTY_VALUE_WRAPPER,
            ShortcodeFormatter.T_TAG_PROPERTY_VALUE_ESCAPE + ShortcodeFormatter.T_TAG_PROPERTY_VALUE_WRAPPER);

        return strValue;
    }
};

ShortcodeFormatter.T_TAG_START = "[";
ShortcodeFormatter.T_TAG_END = "]";
ShortcodeFormatter.T_TAG_START_HTML = "<";
ShortcodeFormatter.T_TAG_END_HTML = ">";
ShortcodeFormatter.T_TAG_CLOSER = "/";
ShortcodeFormatter.T_TAG_PROPERTY_ASSIGN = "=";
ShortcodeFormatter.T_TAG_PROPERTY_VALUE_WRAPPER = '"';
ShortcodeFormatter.T_TAG_PROPERTY_SEPARATOR = ' ';
ShortcodeFormatter.T_TAG_PROPERTY_VALUE_ESCAPE = '\\';

ShortcodeFormatter.DEFAULT_OPTIONS = {
    asHtml: false,
    tagName: null,
    tagNameMap: {}
};

module.exports = ShortcodeFormatter;