let ShortcodeExtractor = require('./shortcode-extractor');
let ShortcodeNode = require('./shortcode-node');
let TextNode = require('./text-node');

/**
 * Utility for parsing text containing Shortcodes into a tree structure.
 */
let ShortcodeTree = {
    /**
     * Parses input text into a tree structure.
     *
     * @param {string} input Text input to parse.
     * @param {object|null} options Parser options.
     * @return {ShortcodeNode}
     */
    parse(input, options) {
        let rootNode = new ShortcodeNode(input);

        this.traverseNode(rootNode, options);

        return rootNode;
    },

    /**
     * Traverses a tree node: extracts short codes from the node text, and traverses its child nodes.
     *
     * @param {ShortcodeNode} node
     * @param {object|null} options Parser options.
     */
    traverseNode(node, options) {
        // Extract shortcodes from this node's raw text
        let shortcodesExtracted = ShortcodeExtractor.extractShortcodes(node.text, options);
        let lastEndIndex = 0;
        let anyChildNodes = false;

        // Iterate each shortcode, and add it as a child node
        for (let key in shortcodesExtracted) {
            let _shortcode = shortcodesExtracted[key];
            let _shortcodeNode = new ShortcodeNode(_shortcode);

            // Determine if we have skipped any text to reach this node; if so, add it as text node
            let skippedLen = _shortcodeNode.shortcode.offset - lastEndIndex;

            if (skippedLen > 0) {
                node.addChild(new TextNode(node.text.substr(lastEndIndex, skippedLen)));
            }

            // Add the new shortcode node as a child node to the one we're traversing
            node.addChild(_shortcodeNode);

            lastEndIndex = _shortcodeNode.shortcode.getEndOffset();
            anyChildNodes = true;

            // Recursive loop: Traverse the child node as well
            this.traverseNode(_shortcodeNode, options);
        }

        // Text node any remaining length, if there were any child nodes
        // (Otherwise this node's text property / shortcode content property will do just fine)
        if (anyChildNodes && node.text) {
            let remainingLen = node.text.length - lastEndIndex;

            if (remainingLen > 0) {
                node.addChild(new TextNode(node.text.substr(lastEndIndex, remainingLen)));
            }
        }
    }
};

module.exports = ShortcodeTree;
