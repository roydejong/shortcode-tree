let ShortcodeParser = require('./shortcode-parser');
let ShortcodeExtractor = require('./shortcode-extractor');
let ShortcodeNode = require('./shortcode-node');

/**
 * Utility for parsing text containing Shortcodes into a tree structure.
 */
let ShortcodeTree = {
    /**
     * Parses input text into a tree structure.
     *
     * @param {string} input
     * @return {ShortcodeNode}
     */
    parse(input) {
        let rootNode = new ShortcodeNode(input);

        this.traverseNode(rootNode);

        return rootNode;
    },

    /**
     * Traverses a tree node: extracts short codes from the node text, and traverses its child nodes.
     *
     * @param {ShortcodeNode} node
     */
    traverseNode(node) {
        let shortcodesExtracted = ShortcodeExtractor.extractShortcodes(node.text);

        for (let key in shortcodesExtracted) {
            let _shortcode = shortcodesExtracted[key];

            let _newNode = new ShortcodeNode(_shortcode);
            node.addChild(_newNode);
            this.traverseNode(_newNode);
        }
    }
};

module.exports = ShortcodeTree;
