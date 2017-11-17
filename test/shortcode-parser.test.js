let ShortcodeParser = require('../src/shortcode-parser');
let Shortcode = require('../src/shortcode');

let {expect} = require('chai');

describe('ShortcodeParser.parseShortcode()', function () {
    it('parse a simple shortcode with content', function () {
        let testInput = "[b]bold text[/b]";
        let expectedOutput = new Shortcode("b", "bold text", {});
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parse a simple shortcode that is self-closing', function () {
        let testInput = "[separator/]";
        let expectedOutput = new Shortcode("separator", null, {}, true);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parse a simple shortcode that is self-closing with an extra space', function () {
        let testInput = "[separator /]";
        let expectedOutput = new Shortcode("separator", null, {}, true);
        let actualOutput = ShortcodeParser.parseShortcode(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});