class Shortcode {
    constructor (name, content, properties, isSelfClosing, codeText, offset) {
        this.name = name || null;
        this.content = (typeof content === "undefined" ? null : content);
        this.properties = properties || {};
        this.isSelfClosing = !!isSelfClosing;
        this.codeText = codeText || null;
        this.offset = offset || 0;
    }
}

module.exports = Shortcode;
