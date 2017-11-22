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
    stringify(shortcode) {
        let buffer = "";

        // Open tag "[name"
        buffer += ShortcodeFormatter.T_TAG_START;
        buffer += shortcode.name;

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
                if (this.getShouldValueBeLiteral(value)) {
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

        buffer += ShortcodeFormatter.T_TAG_END;

        // Add raw content
        if (shortcode.content) {
            buffer += shortcode.content;
        }

        // Add close tag
        if (!shortcode.isSelfClosing) {
            buffer += ShortcodeFormatter.T_TAG_START;
            buffer += ShortcodeFormatter.T_TAG_CLOSER;
            buffer += shortcode.name;
            buffer += ShortcodeFormatter.T_TAG_END;
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
ShortcodeFormatter.T_TAG_CLOSER = "/";
ShortcodeFormatter.T_TAG_PROPERTY_ASSIGN = "=";
ShortcodeFormatter.T_TAG_PROPERTY_VALUE_WRAPPER = '"';
ShortcodeFormatter.T_TAG_PROPERTY_SEPARATOR = ' ';
ShortcodeFormatter.T_TAG_PROPERTY_VALUE_ESCAPE = '\\';

module.exports = ShortcodeFormatter;