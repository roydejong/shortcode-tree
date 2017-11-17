let ShortcodeParser = require('../src/shortcode-parser');
let Shortcode = require('../src/shortcode');

let {expect} = require('chai');

describe('ShortcodeParser.parseShortcode()', function () {
    it('parses a simple shortcode with content', function () {
        let testInput = "[b]bold text[/b]";
        let expectedOutput = new Shortcode("b", "bold text", {});
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a simple shortcode with no content', function () {
        let testInput = "[b][/b]";
        let expectedOutput = new Shortcode("b", "", {});
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property', function () {
        let testInput = `[text color="red"]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": "red"});
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses self-closing shortcodes', function () {
        let testInput = "[separator/]";
        let expectedOutput = new Shortcode("separator", null, {}, true);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses self-closing shortcodes with an extra space', function () {
        let testInput = "[separator /]";
        let expectedOutput = new Shortcode("separator", null, {}, true);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses self-closing shortcodes with mixed properties', function () {
        let testInput = `[image id=123 src="bla.jpg" align="center"/]`;
        let expectedOutput = new Shortcode("image", null, {"id": "123", "src": "bla.jpg", "align": "center"}, true);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});