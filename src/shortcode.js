class Shortcode {
    constructor (name, content, properties, isSelfClosing) {
        this.name = name || null;
        this.content = (typeof content === "undefined" ? null : content);
        this.properties = properties || {};
        this.isSelfClosing = !!isSelfClosing;
    }
}

module.exports = Shortcode;
