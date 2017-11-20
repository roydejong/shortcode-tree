let ShortcodeExtractor = require('../src').ShortcodeExtractor;

let {expect} = require('chai');

describe('ShortcodeExtractor.extractShortcodeTexts()', function () {
    it('extracts a simple shortcode', function () {
        let testInput = "[b]bold text[/b]";
        let expectedOutput = [testInput];

        let actualOutput = ShortcodeExtractor.extractShortcodeTexts(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('extracts a simple shortcode with text surrounding it', function () {
        let testInput = "Check out [b]bold text[/b], it's pretty cool.";
        let expectedOutput = ["[b]bold text[/b]"];

        let actualOutput = ShortcodeExtractor.extractShortcodeTexts(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});