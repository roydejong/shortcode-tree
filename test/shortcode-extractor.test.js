let ShortcodeExtractor = require('../src').ShortcodeExtractor;
let Shortcode = require('../src').Shortcode;

let {expect} = require('chai');

describe('ShortcodeExtractor.extractShortcodes()', function () {
    it('extracts a simple shortcode', function () {
        let testInput = "[b]bold text[/b]";
        let expectedOutput = [new Shortcode("b", "bold text", {}, false, testInput)];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('extracts a simple shortcode with text surrounding it', function () {
        let testInput = "Check out [b]bold wrap text[/b], it's pretty cool.";
        let expectedOutput = [new Shortcode("b", "bold wrap text", {}, false, "[b]bold wrap text[/b]")];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('extracts multiple simple shortcodes on the same level', function () {
        let testInput = "[b]boldest text[/b][i]bats[/i]";

        let expectedOutput = [
            new Shortcode("b", "boldest text", {}, false, "[b]boldest text[/b]"),
            new Shortcode("i", "bats", {}, false, "[i]bats[/i]")
        ];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});