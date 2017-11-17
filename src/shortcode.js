class Shortcode {
    constructor (name, content, properties, isSelfClosing) {
        this.name = name || null;
        this.content = content || null;
        this.properties = properties || {};
        this.isSelfClosing = !!isSelfClosing;
    }
}

module.exports = Shortcode;
