class Shortcode {
    constructor (name, content, properties, isSelfClosing, codeText) {
        this.name = name || null;
        this.content = (typeof content === "undefined" ? null : content);
        this.properties = properties || {};
        this.isSelfClosing = !!isSelfClosing;
        this.codeText = codeText || null;
    }
}

module.exports = Shortcode;
