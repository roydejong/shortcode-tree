let Shortcode = require('../src').Shortcode;
let ShortcodeFormatter = require('../src').ShortcodeFormatter;

let {expect} = require('chai');

describe('ShortcodeFormatter.stringify()', function () {
    it('stringifies a simple shortcode with content', function () {
        let testInput = new Shortcode("b", "Bold text");
        let expectedOutput = "[b]Bold text[/b]";
        let actualOutput = ShortcodeFormatter.stringify(testInput);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a shortcode with content and text properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"font-weight": "bolder"});
        let expectedOutput = `[b font-weight="bolder"]Bold text[/b]`;
        let actualOutput = ShortcodeFormatter.stringify(testInput);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a simple shortcode with content and value-less properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"checked": null});
        let expectedOutput = "[b checked]Bold text[/b]";
        let actualOutput = ShortcodeFormatter.stringify(testInput);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a simple shortcode, but leaves out value-less properties with `blankProperties` config set to false', function () {
        let testInput = new Shortcode("b", "Bold text", {"checked": null});
        let expectedOutput = "[b]Bold text[/b]";
        let actualOutput = ShortcodeFormatter.stringify(testInput, { blankProperties: false });

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a self-closing shortcode', function () {
        let testInput = new Shortcode("img", null, {}, true);
        let expectedOutput = "[img/]";
        let actualOutput = ShortcodeFormatter.stringify(testInput);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a self-closing shortcode with text properties', function () {
        let testInput = new Shortcode("img", null, {"src": "sample.jpeg", "align": "center"}, true);
        let expectedOutput = `[img src="sample.jpeg" align="center"/]`;
        let actualOutput = ShortcodeFormatter.stringify(testInput);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('correctly escapes quotes in string literals in shortcode properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"name": `Mr. "Badass" McGee`});
        let expectedOutput = `[b name="Mr. \\"Badass\\" McGee"]Bold text[/b]`;
        let actualOutput = ShortcodeFormatter.stringify(testInput);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('correctly escapes square brackets in string literals in shortcode properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"name": `[b]embedded[/b]`});
        let expectedOutput = `[b name="&#91;b&#93;embedded&#91;/b&#93;"]Bold text[/b]`;
        let actualOutput = ShortcodeFormatter.stringify(testInput);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('does not format single number values as string literals in shortcode properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"one": `100%`, "two": 123, "three": 123.45, "four": "12345"});
        let expectedOutput = `[b one="100%" two=123 three="123.45" four=12345]Bold text[/b]`;
        let actualOutput = ShortcodeFormatter.stringify(testInput);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('shortcode.stringify() acts as an exact alias', function () {
        let testInput = new Shortcode("any", "Whatever", {sample: 123});
        let actualOutput = ShortcodeFormatter.stringify(testInput);
        let actualOutputAlias = testInput.stringify();

        expect(actualOutput).to.equal(actualOutputAlias);
    });
});

describe('ShortcodeFormatter.stringify() in HTML mode', function () {
    let config = {
        asHtml: true
    };

    it('stringifies a simple shortcode with content', function () {
        let testInput = new Shortcode("b", "Bold text");
        let expectedOutput = "<b>Bold text</b>";
        let actualOutput = ShortcodeFormatter.stringify(testInput, config);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a shortcode with content and text properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"font-weight": "bolder"});
        let expectedOutput = `<b font-weight="bolder">Bold text</b>`;
        let actualOutput = ShortcodeFormatter.stringify(testInput, config);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a simple shortcode with content and value-less properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"checked": null});
        let expectedOutput = "<b checked>Bold text</b>";
        let actualOutput = ShortcodeFormatter.stringify(testInput, config);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a self-closing shortcode', function () {
        let testInput = new Shortcode("img", null, {}, true);
        let expectedOutput = "<img/>";
        let actualOutput = ShortcodeFormatter.stringify(testInput, config);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('stringifies a self-closing shortcode with text properties', function () {
        let testInput = new Shortcode("img", null, {"src": "sample.jpeg", "align": "center"}, true);
        let expectedOutput = `<img src="sample.jpeg" align="center"/>`;
        let actualOutput = ShortcodeFormatter.stringify(testInput, config);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('correctly escapes quotes in string literals in shortcode properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"name": `Mr. "Badass" McGee`});
        let expectedOutput = `<b name="Mr. \\"Badass\\" McGee">Bold text</b>`;
        let actualOutput = ShortcodeFormatter.stringify(testInput, config);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('does not format single number values as string literals in shortcode properties', function () {
        let testInput = new Shortcode("b", "Bold text", {"one": `100%`, "two": 123, "three": 123.45, "four": "12345"});
        let expectedOutput = `<b one="100%" two="123" three="123.45" four="12345">Bold text</b>`;
        let actualOutput = ShortcodeFormatter.stringify(testInput, config);

        expect(actualOutput).to.equal(expectedOutput);
    });

    it('shortcode.stringifyAsHtml() acts as an exact alias', function () {
        let testInput = new Shortcode("any", "Whatever", {sample: 123});
        let actualOutput = ShortcodeFormatter.stringify(testInput, config);
        let actualOutputAlias = testInput.stringifyAsHtml();

        expect(actualOutput).to.equal(actualOutputAlias);
    });
});