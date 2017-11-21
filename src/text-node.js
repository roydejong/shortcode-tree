class TextNode {
    constructor (text) {
        this.text = text;
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

        console.log(fnRepeatChar('-', level) + '[Text Node], content: ' + this.text);
    }
}

module.exports = TextNode;