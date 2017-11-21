class Shortcode {
    constructor (name, content, properties, isSelfClosing, codeText, offset) {
        this.name = name || null;
        this.content = (typeof content === "undefined" ? null : content);
        this.properties = properties || {};
        this.isSelfClosing = !!isSelfClosing;
        this.codeText = codeText || null;
        this.offset = offset || 0;
    }

    getEndOffset() {
        return this.offset + this.codeText.length;
    }

    hasProperty(key) {
        return this.properties && (typeof this.properties[key] !== "undefined");
    }

    getProperty(key) {
        return this.hasProperty(key) ? this.properties[key] : null;
    }

    setProperty(key, value) {
        this.properties[key] = value;
    }
}

module.exports = Shortcode;
