let ShortcodeParser = require('../src').ShortcodeParser;
let Shortcode = require('../src').Shortcode;

let {expect} = require('chai');

describe('ShortcodeParser.parseShortcode() with defaults (fast mode)', function () {
    let options = ShortcodeParser.DEFAULT_OPTIONS;

    it('parses a simple shortcode with content', function () {
        let testInput = "[b]bold text[/b]";
        let expectedOutput = new Shortcode("b", "bold text", {}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a simple shortcode with no content', function () {
        let testInput = "[b][/b]";
        let expectedOutput = new Shortcode("b", "", {}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property', function () {
        let testInput = `[text color=red]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": "red"}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property with string literal', function () {
        let testInput = `[text color="stupid red"]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": "stupid red"}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property with blank string literal', function () {
        let testInput = `[text color=""]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": ""}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a shortcode with a property with escape sequence', function () {
        let testInput = `[text color="the \\\"super escape\\\""]test[/text]`;
        let expectedOutput = new Shortcode("text", "test", {"color": 'the "super escape"'}, false, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a self-closing shortcode', function () {
        let testInput = "[separator/]";
        let expectedOutput = new Shortcode("separator", null, {}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a self-closing shortcode with an extra space', function () {
        let testInput = "[separator /]";
        let expectedOutput = new Shortcode("separator", null, {}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a self-closing shortcode with mixed properties', function () {
        let testInput = `[image id=123 src="bla.jpg" align="center"/]`;
        let expectedOutput = new Shortcode("image", null, {"id": "123", "src": "bla.jpg", "align": "center"}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a self-closing shortcode with ending integer property', function () {
        let testInput = `[image id=123/]`;
        let expectedOutput = new Shortcode("image", null, {"id": "123"}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a self-closing shortcode with value-less property', function () {
        let testInput = `[image zz id=123/]`;
        let expectedOutput = new Shortcode("image", null, {"zz": null, "id": "123"}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses only the first shortcode from a set of sticky shortcodes', function () {
        let testInput = `[b]test[/b] not [i]italics[/i]`;
        let expectedOutput = new Shortcode("b", "test", {}, false, "[b]test[/b]");
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses the first shortcode encountered by detecting the opening tag', function () {
        let testInput = `another offset [b]test[/b] not [i]italics[/i]`;
        let expectedOutput = new Shortcode("b", "test", {}, false, "[b]test[/b]", 15);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('calculates the correct code text for self-closing tags in an offset string', function () {
        let testInput = `edge case [antics/] are here`;
        let expectedOutput = new Shortcode("antics", null, {}, true, "[antics/]", 10);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('throws an error for malformatted input: missing opening tag', function () {
        let testInput = `no opening tag`;

        expect(function () {
            ShortcodeParser.parseShortcode(testInput, options)
        }).to.throw("opening tag");
    });

    it('throws an error for malformatted input: just a closing tag', function () {
        let testInput = `[/closer]`;

        expect(function () {
            ShortcodeParser.parseShortcode(testInput, options)
        }).to.throw("opening tag");
    });

    it('does not error / performs best guess for malformatted input: invalid/missing closing tag', function () {
        let testInput = `we [open] but no [/close]`;

        let expectedOutput = new Shortcode("open", null, {}, true, "[open]", 3);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a broken self-closing shortcode with ending integer property', function () {
        let testInput = `[image id=123]`;
        let expectedOutput = new Shortcode("image", null, {"id": "123"}, true, testInput);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, options) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('throws an error for malformatted input: invalid opening tag', function () {
        let testInput = `we [ ] weirdly`;

        expect(function () {
            ShortcodeParser.parseShortcode(testInput, options)
        }).to.throw("opening tag");
    });

    it('throws an error for malformatted input: misplaced property quotes', function () {
        let testInput = `we [img bla=a"/] weirdly`;

        expect(function () {
            ShortcodeParser.parseShortcode(testInput, options)
        }).to.throw("T_TAG_PROPERTY_VALUE_WRAPPER");
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

describe('ShortcodeParser.parseShortcode() with modified options', function () {
    it('supports parsing with an offset', function () {
        let testInput = "[b]ignore[/b] but [i]parse[/i]";
        let expectedOutput = new Shortcode('i', 'parse', {}, false, "[i]parse[/i]", 18);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, { offset: 13 }) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('does not throw errors if "throwErrors" is set to false', function () {
        let testInput = "this might be [invalid";
        let expectedOutput = false;
        let actualOutput = ShortcodeParser.parseShortcode(testInput, { throwErrors: false });

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('supports parsing self-closing tags without valid syntax, with list supplement', function () {
        let testInput = `[img src="what.jpg" standards="no"]`;
        let expectedOutput = new Shortcode('img', null, {"src": "what.jpg", "standards": "no"}, true, `[img src="what.jpg" standards="no"]`, 0);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, { selfClosingTags: ["img"] }) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('supports parsing self-closing tags without valid syntax, with list supplement, without tripping over tags that decide to have a closer anyway', function () {
        let testInput = `[img src="what.jpg" standards="no"][/img] asdf`;
        let expectedOutput = new Shortcode('img', "", {"src": "what.jpg", "standards": "no"}, false, `[img src="what.jpg" standards="no"][/img]`, 0);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, { selfClosingTags: ["img"] }) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});

describe('ShortcodeParser.parseShortcode() in "precise" mode', function () {
    it('correctly parses a tag with same-name tags on that level', function () {
        let testInput = "[col]a[/col][col]b[/col][col]c[/col]";

        let expectedOutput = new Shortcode('col', 'a', {}, false, "[col]a[/col]", 0);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, { precise: true }) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('correctly parses a tag with same-name tags as its children', function () {
        let testInput = "[col]text [col]deeper col[/col] content[/col]";

        let expectedOutput = new Shortcode('col', 'text [col]deeper col[/col] content', {}, false, "[col]text [col]deeper col[/col] content[/col]", 0);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, { precise: true }) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('correctly parses self-closing short tags', function () {
        let testInput = "blah [img bla=123/] argh";

        let expectedOutput = new Shortcode('img', null, {"bla": "123"}, true, "[img bla=123/]", 5);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, { precise: true }) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('correctly parses self-closing short tags as children', function () {
        let testInput = "[col][img bla=123/][/col]";

        let expectedOutput = new Shortcode('col', '[img bla=123/]', {}, false, "[col][img bla=123/][/col]", 0);
        let actualOutput = ShortcodeParser.parseShortcode(testInput, { precise: true }) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});