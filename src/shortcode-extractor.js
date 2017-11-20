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

        let m;

        let matches = [];

        while ((m = regex.exec(text)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            m.forEach((match, groupIndex) => {
                if (groupIndex === 0) {
                    matches = matches.concat(this.reduceShortcodeMatch(match));
                }
            });
        }

        return matches;
    },

    /**
     * Attempts to "unstick" multiple blocks matched in one piece of text.
     *
     * @param {string} matchText
     * @returns {array}
     */
    reduceShortcodeMatch (matchText) {
        let results = [];
        let remainingText = matchText;

        while (remainingText.length > 0) {
            let parsed = ShortcodeParser.parseShortcode(remainingText);
            results.push(parsed);

            remainingText = remainingText.substr(ShortcodeParser.lastOffset + parsed.codeText.length);
        }

        return results;
    }
};

module.exports = ShortcodeExtractor;