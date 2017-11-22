let ShortcodeFormatter = require('./shortcode-formatter');

/**
 * Data structure that represents a single [shortcode].
 */
class Shortcode {
    constructor (name, content, properties, isSelfClosing, codeText, offset) {
        /**
         * The tag name.
         *
         * @type {null|string}
         */
        this.name = name || null;

        /**
         * Raw content contained within this shortcode.
         * Will be NULL for self-closing tags.
         *
         * @type {null|string}
         */
        this.content = (typeof content === "undefined" ? null : content);

        /**
         * Key/value object that holds all properties for this shortcode.
         *
         * @type {object}
         */
        this.properties = properties || {};

        /**
         * Indicates whether this is a self-closing tag or not.
         *
         * @type {boolean}
         */
        this.isSelfClosing = !!isSelfClosing;

        /**
         * Raw text block that was parsed for this shortcode.
         *
         * @type {string|null}
         */
        this.codeText = codeText || null;

        /**
         * Offset, relative to the extractor input string.
         *
         * @type {number}
         */
        this.offset = offset || 0;
    }

    /**
     * Internal helper function: Get the end offset of this shortcode, relative to the extractor input string.
     *
     * @returns {*}
     */
    getEndOffset() {
        return this.offset + this.codeText.length;
    }

    /**
     * Gets whether this shortcode has a set property with a given `key`.
     *
     * @param {string} key
     * @returns {boolean}
     */
    hasProperty(key) {
        return this.properties && (typeof this.properties[key] !== "undefined");
    }

    /**
     * Get the value of a property.
     *
     * @param key
     * @returns {string|null}
     */
    getProperty(key) {
        return this.hasProperty(key) ? this.properties[key] : null;
    }

    /**
     * Add or update a property.
     *
     * @param {string} key
     * @param value
     */
    setProperty(key, value) {
        this.properties[key] = value;
    }

    /**
     * Appends a given `shortcode` to this shortcode's content, by rendering the input as a string.
     *
     * @param {Shortcode} shortcode
     */
    addChild(shortcode) {
        this.appendContent(shortcode.stringify());
    }

    /**
     * Appends given `content` to the end of this shortcode's content.
     *
     * @param {string} content
     */
    appendContent(content) {
        this.content += content;
    }

    /**
     * Renders this Shortcode as formatted code.
     *
     * @returns {string}
     */
    stringify() {
        return ShortcodeFormatter.stringify(this);
    }

    /**
     * Converts this item to string.
     *
     * @returns {string}
     */
    toString() {
        return this.stringify();
    }
}

module.exports = Shortcode;
