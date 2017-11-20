let ShortcodeParser = require('./shortcode-parser');

/**
 * Utility for extracting generic, unspecified shortcodes from a raw input text.
 */
let ShortcodeExtractor = {
    /**
     * Extracts all shortcode blocks from an input text, one level deep.
     *
     * @param {string} text
     * @returns {Array}
     */
    extractShortcodeTexts(text) {
        // Perform a generic regex match that will match any block spanning [XXX] to [/XXX].
        // Because it is a generic regex, this may also result in a matching multiple blocks on the same level; e.g. [XXX]bla[/XXX][YYY]bla2[/YYY].
        // Worse yet, in the case of malformatted shortcodes, this won't work reliably at all. That's a TODO: Figure out how to deal with malformatted input elegantly
        const regex = /\[(.*)\]([\S\s]*)\[\/(.*)\]/g;

        let set = [];
        let m;

        while ((m = regex.exec(text)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            m.forEach((match, groupIndex) => {
                if (groupIndex === 0) {
                    set.push(match);
                }
            });
        }

        return set;
    },
};

module.exports = ShortcodeExtractor;