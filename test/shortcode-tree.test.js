let ShortcodeTree = require('../src').ShortcodeTree;
let ShortcodeNode = require('../src').ShortcodeNode;
let ShortcodeParser = require('../src').ShortcodeParser;
let TextNode = require('../src').TextNode;

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

    it('parses raw text input into the content of the root node', function () {
        let testInput = "hello, how are you?";

        let expectedOutput = new ShortcodeNode("hello, how are you?");

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

    it('parses combined shortcodes / text nodes into a children of one root node', function () {
        let testInputTxt0 = "blah blah blah";
        let testInputB = "[b]hello?[/b]";
        let testInputTxt1 = "<h1>html mixed in</h1>";
        let testInputU = "[u]hello~[/u]";
        let testInputTxt2 = "<p>html mixed in again</p>";

        let testInputAll = testInputTxt0 + testInputB + testInputTxt1 + testInputU + testInputTxt2;

        let expectedOutput = new ShortcodeNode(testInputAll);

        let expectedTxt0 = new TextNode(testInputTxt0);
        expectedOutput.addChild(expectedTxt0);

        let expectedB = ShortcodeParser.parseShortcode(testInputB);
        expectedB.offset = 14;
        expectedOutput.addChild(new ShortcodeNode(expectedB));

        let expectedTxt1 = new TextNode(testInputTxt1);
        expectedOutput.addChild(expectedTxt1);

        let expectedU = ShortcodeParser.parseShortcode(testInputU);
        expectedU.offset = 49;
        expectedOutput.addChild(new ShortcodeNode(expectedU));

        let expectedTxt2 = new TextNode(testInputTxt2);
        expectedOutput.addChild(expectedTxt2);

        // [Root node with full text]
        // -> Text node
        // -> [b] node with text content
        // -> Text node
        // -> [u] node with text content
        // -> Text node

        let actualOutput = ShortcodeTree.parse(testInputAll);
        expect(actualOutput).to.deep.equal(expectedOutput);
    });
});