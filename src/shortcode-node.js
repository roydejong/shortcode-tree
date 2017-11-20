let Shortcode = require('./shortcode');

class ShortcodeNode {
    constructor (content) {
        if (content instanceof Shortcode) {
            this.text = content.content;
            this.shortcode = content;
        } else if (content) {
            this.text = content.toString();
            this.shortcode = null;
        } else {
            this.text = null;
            this.shortcode = null;
        }

        this.children = [];
    }

    hasShortcode() {
        return this.shortcode != null;
    }

    hasText() {
        return this.text != null;
    }

    addChild(node) {
        this.children.push(node);
    }

    hasChildren() {
        return this.children.length > 0;
    }
}

module.exports = ShortcodeNode;
