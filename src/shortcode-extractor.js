let ShortcodeParser = require('./shortcode-parser');

/**
 * Utility for extracting generic, unspecified shortcodes from a raw input text.
 */
let ShortcodeExtractor = {
    /**
     * Extract and parse all shortcodes from input text, but only one level deep.
     *
     * @param {string} text
     * @returns {Shortcode[]|array}
     */
    extractShortcodes(text) {
        // Perform a generic regex match that will match any block spanning [XXX] to [/XXX].
        // Because it is a generic regex, this may also result in a matching multiple blocks on the same level; e.g. [XXX]bla[/XXX][YYY]bla2[/YYY].
        // Worse yet, in the case of malformatted shortcodes, this won't work reliably at all. That's a TODO: Figure out how to deal with malformatted input elegantly
        const regex = /\[(.*)\]([\S\s]*)\[\/(.*)\]/g;

        let match;
        let resultSet = [];

        while ((match = regex.exec(text)) !== null) {
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            resultSet = resultSet.concat(this.reduceShortcodeMatch(text, match.index));
        }

        return resultSet;
    },

    /**
     * Attempts to "unstick" multiple blocks matched in one piece of text.
     *
     * @param {string} text
     * @param {int} offset
     * @returns {array}
     */
    reduceShortcodeMatch(text, offset) {
        let results = [];

        while (offset < text.length) {
            let parsedShortcode = ShortcodeParser.parseShortcode(text, {offset: offset, throwErrors: false});

            if (!parsedShortcode) {
                // Parse error
                break;
            }

            results.push(parsedShortcode);

            offset = parsedShortcode.offset + parsedShortcode.codeText.length;
        }

        return results;
    }
};

module.exports = ShortcodeExtractor;