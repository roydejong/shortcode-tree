let ShortcodeParser = require('../src').ShortcodeParser;
let Shortcode = require('../src').Shortcode;

let {expect} = require('chai');

describe('ShortcodeParser.parseShortcode() in normal mode', function () {
    it('parses a simple shortcode with content', function () {
        let testInput = "[b]bold text[/b]";
        let expectedOutput = new Shortcode("b", "bold text", {}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a simple shortcode with no content', function () {
        let testInput = "[b][/b]";
        let expectedOutput = new Shortcode("b", "", {}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property', function () {
        let testInput = `[text color=red]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": "red"}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property with string literal', function () {
        let testInput = `[text color="stupid red"]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": "stupid red"}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property with blank string literal', function () {
        let testInput = `[text color=""]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": ""}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property with escape sequence', function () {
        let testInput = `[text color="the \\\"super escape\\\""]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": 'the "super escape"'}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a self-closing shortcode', function () {
        let testInput = "[separator/]";
        let expectedOutput = new Shortcode("separator", null, {}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a self-closing shortcode with an extra space', function () {
        let testInput = "[separator /]";
        let expectedOutput = new Shortcode("separator", null, {}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a self-closing shortcode with mixed properties', function () {
        let testInput = `[image id=123 src="bla.jpg" align="center"/]`;
        let expectedOutput = new Shortcode("image", null, {"id": "123", "src": "bla.jpg", "align": "center"}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses only the first shortcode from a set of sticky shortcodes', function () {
        let testInput = `[b]test[/b] not [i]italics[/i]`;
        let expectedOutput = new Shortcode("b", "test", {}, false, "[b]test[/b]");
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});

describe('ShortcodeParser.parseShortcode() in MODE_GET_OPENING_TAG_NAME', function () {
    let options = {
        mode: ShortcodeParser.MODE_GET_OPENING_TAG_NAME
    };

    it('parses a simple shortcode and returns its opening name, regardless of closing tag mismatch', function () {
        let testInput = "[blah]bold text[/boop]";
        let expectedOutput = "blah";
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('parses a self-closing shortcode and returns its opening name', function () {
        let testInput = "[blahp/]";
        let expectedOutput = "blahp";
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.equal(expectedOutput);
    });
});