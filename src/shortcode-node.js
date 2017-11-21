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

    isRootNode() {
        return !this.hasShortcode();
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

    traceTree(level) {
        if (!level) {
            level = 0;
        }

        let fnRepeatChar = function (char, level) {
            if (level === 0) {
                return "";
            }

            let chars = "";

            for (let i = 0; i < (level * 3); i++) {
                chars += char;
            }

            return chars + " ";
        };

        if (this.isRootNode()) {
            console.log('+++++ Root Node +++++');
            level = 0;
        } else {
            console.log(fnRepeatChar('-', level) + '[Shortcode Node: ' + this.shortcode.name + '], content: ' + this.shortcode.content);
            level++;
        }

        for (let i = 0; i < this.children.length; i++) {
            let childNode = this.children[i];
            childNode.traceTree(level);
        }
    }
}

module.exports = ShortcodeNode;
