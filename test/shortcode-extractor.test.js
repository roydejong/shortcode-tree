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

    it('extracts a self-closing shortcode with text surrounding it', function () {
        let testInput = "Check out [img src=abc.jpg/], a cool image";
        let expectedOutput = [new Shortcode("img", null, {"src": "abc.jpg"}, true, "[img src=abc.jpg/]", 10)];

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

    it('extracts a tag with nested sub-tags', function () {
        let testInput = "Hi [row]A[row][cell]B[/cell][/row]C[/row] Bye";
        let expectedOutput = [new Shortcode("row", "A[row][cell]B[/cell][/row]C", {}, false, "[row]A[row][cell]B[/cell][/row]C[/row]", 3)];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('extracts multiple tags with the same name at the same level individually, without mixing them up', function () {
        let testInput = "[column]1[/column][column]2[/column]";

        let expectedOutput = [
            new Shortcode("column", "1", {}, false, "[column]1[/column]", 0),
            new Shortcode("column", "2", {}, false, "[column]2[/column]", 18)
        ];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('extracts multiple tags with the same name from one level, while ignoring ones with the same name at a deeper level', function () {
        let testInput =
        "[column]" +
            "[column]subA1[/column]" +
            "[column]subA2[/column]" +
        "[/column]" +
        "[column]" +
            "[column]subB1[/column]" +
            "[column]subB2[/column]" +
        "[/column]";

        let expectedOutput = [
            new Shortcode("column", "[column]subA1[/column][column]subA2[/column]", {}, false, "[column]" +
                "[column]subA1[/column]" +
                "[column]subA2[/column]" +
                "[/column]", 0),
            new Shortcode("column", "[column]subB1[/column][column]subB2[/column]", {}, false, "[column]" +
                "[column]subB1[/column]" +
                "[column]subB2[/column]" +
                "[/column]", 61)
        ];

        let actualOutput = ShortcodeExtractor.extractShortcodes(testInput) || null;

        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});