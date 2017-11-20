let ShortcodeTree = require('../src').ShortcodeTree;
let ShortcodeNode = require('../src').ShortcodeNode;
let ShortcodeParser = require('../src').ShortcodeParser;
let Shortcode = require('../src').Shortcode;

let {expect} = require('chai');

describe('ShortcodeTree.parse()', function () {
    it('returns a blank node for blank input', function () {
        let testInput = "";
        let expectedOutput = new ShortcodeNode("");
        let actualOutput = ShortcodeTree.parse(testInput);

        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses a simple shortcode into a single child of the root node', function () {
        let testInput = "[b]hello?[/b]";

        let expectedOutput = new ShortcodeNode(testInput);
        expectedOutput.addChild(new ShortcodeNode(ShortcodeParser.parseShortcode(testInput)));

        // [Root node with full text]
        // -> [b] node with text content

        let actualOutput = ShortcodeTree.parse(testInput);
        expect(actualOutput).to.deep.equal(expectedOutput);
    });

    it('parses multiple simple shortcodes into a children of one root node', function () {
        let testInputB = "[b]hello?[/b]";
        let testInputI = "[i]hello![/i]";
        let testInputU = "[u]hello~[/u]";

        let testInputAll = testInputB + testInputI + testInputU;

        let expectedOutput = new ShortcodeNode(testInputAll);

        let expectedB = ShortcodeParser.parseShortcode(testInputB);
        expectedOutput.addChild(new ShortcodeNode(expectedB));

        let expectedI = ShortcodeParser.parseShortcode(testInputI);
        expectedI.offset = 13;
        expectedOutput.addChild(new ShortcodeNode(expectedI));

        let expectedU = ShortcodeParser.parseShortcode(testInputU);
        expectedU.offset = 26;
        expectedOutput.addChild(new ShortcodeNode(expectedU));

        // [Root node with full text]
        // -> [b] node with text content
        // -> [i] node with text content
        // -> [u] node with text content

        let actualOutput = ShortcodeTree.parse(testInputAll);
        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});