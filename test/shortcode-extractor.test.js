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
        let expectedOutput = [new Shortcode("b", "bold wrap text", {}, false, "[b]bold wrap text[/b]", 10)];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('extracts multiple simple shortcodes on the same level', function () {
        let testInput = "[b]boldest text[/b][i]bats[/i]";

        let expectedOutput = [
            new Shortcode("b", "boldest text", {}, false, "[b]boldest text[/b]", 0),
            new Shortcode("i", "bats", {}, false, "[i]bats[/i]", 19)
        ];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('extracts multiple simple shortcodes on the same level, with text surrounding them', function () {
        let testInput = "Check out my [b]boldest text[/b], but watch out for [i]bats[/i] please!";

        let expectedOutput = [
            new Shortcode("b", "boldest text", {}, false, "[b]boldest text[/b]", 13),
            new Shortcode("i", "bats", {}, false, "[i]bats[/i]", 52)
        ];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});