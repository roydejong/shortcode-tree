let Shortcode = require('./shortcode');

let ShortcodeParser = {
    parseShortcode(input, options) {
        if (!options) {
            options = ShortcodeParser.DEFAULT_OPTIONS;
        } else {
            options = Object.assign({}, ShortcodeParser.DEFAULT_OPTIONS, options);
        }

        let shortcode = new Shortcode();

        // Step 1: Apply offset from options, then increase offset as needed by looking for an opening tag
        input = input.substr(options.offset);

        let openingBlockMatch = /\[[^\/](.*?)\]/g.exec(input);

        if (!openingBlockMatch) {
            if (options.throwErrors) {
                throw new Error(`Could not parse shortcode: No opening tag detected in ${input}.`);
            } else {
                return false;
            }
        }

        input = input.substr(openingBlockMatch.index);
        shortcode.offset = options.offset + openingBlockMatch.index;

        // Step 2: Read the opening block without enclosing []'s
        let openBlockStartIdx = 0;
        let openBlockEndIdx = input.indexOf(ShortcodeParser.T_TAG_BLOCK_END);
        let openBlockTextFull = input.substr(openBlockStartIdx, openBlockEndIdx + 1);
        let openBlockInner = openBlockTextFull.substr(1, openBlockTextFull.length - 2).trim();

        if (!openBlockInner || !openBlockInner.length) {
            if (options.throwErrors) {
                throw new Error(`Malformatted shortcode: Invalid or missing opening tag in ${input}`);
            } else {
                return false;
            }
        }

        // Step 3: Read the block's name and properties by tokenizing it
        if (this.tokenizeOpenBlock(shortcode, openBlockInner, options) === false) {
            return false;
        }

        if (options.mode === ShortcodeParser.MODE_GET_OPENING_TAG_NAME) {
            return shortcode.name;
        }

        // Step 4: If we are in fast mode, try reading forward until we find the closing tag.
        //  Otherwise, if we are in precise mode, keep parsing everything past our tag until we find *our* closing tag.
        let closingTagExpected = `[/${shortcode.name}]`;

        let predictedAsSelfClosing = input.indexOf(closingTagExpected) === -1;

        if (predictedAsSelfClosing) {
            shortcode.isSelfClosing = true;
        } else {
            shortcode.isSelfClosing = false;
        }

        if (shortcode.isSelfClosing && input.substr(openBlockTextFull.length, closingTagExpected.length) === closingTagExpected) {
            // Special case: misbehaving little bugger claims to be improperly self-closing, but decided to close itself
            // anyway. I've seen this happen in the wild, and it sucks, so we'll try to deal with it.
            let closingTagIdx = openBlockTextFull.length;
            let offsetFromEnd = (input.length - closingTagExpected.length) - closingTagIdx;

            shortcode.content = input.substr(openBlockStartIdx + openBlockTextFull.length, (input.length - openBlockTextFull.length - closingTagExpected.length - offsetFromEnd));
            shortcode.codeText = input.substr(openBlockStartIdx, input.length - offsetFromEnd);

            shortcode.isSelfClosing = false;
        } else if (options.precise && !shortcode.isSelfClosing) {
            let stackLevel = 0;

            let bufferRemainder = input.substr(openBlockTextFull.length);
            let bufferContent = "";
            let closingTagFound = null;

            let subParseOptions = Object.assign({}, options, {
                throwErrors: false,
                mode: ShortcodeParser.MODE_NORMAL
            });

            while (bufferRemainder.length > 0) {
                // Keep iterating the remainder of the input buffer, looking for any other closing or opening tags
                let nextBlockMatch = /\[(.*?)\]/g.exec(bufferRemainder);

                if (!nextBlockMatch) {
                    // No more tags found, end of input
                    break;
                }

                let nextBlockIdx = nextBlockMatch.index;
                let nextBlockText = nextBlockMatch[0];
                let nextBlockTextInner = nextBlockText.substr(1, nextBlockText.length - 2).trim();
                let nextBlockLen = nextBlockText.length;

                if (nextBlockTextInner.startsWith("/")) {
                    // Closing tag
                    if (stackLevel === 0) {
                        if (nextBlockText !== closingTagExpected) {
                            if (options.throwErrors) {
                                throw new Error(`Malformatted shortcode: Inconsistent closing tag. Expected closing tag: ${closingTagExpected}, but found ${nextBlockText}`);
                            } else {
                                return false;
                            }
                        }

                        closingTagFound = nextBlockText;

                        bufferContent += bufferRemainder.substr(0, nextBlockIdx);
                        break;
                    } else {
                        stackLevel--;
                    }
                } else {
                    // Open tag
                    let nextBlockInfo = new Shortcode();

                    if (this.tokenizeOpenBlock(nextBlockInfo, nextBlockTextInner, subParseOptions) !== false) {
                        let blockName = nextBlockInfo.name;
                        // console.log(nextBlockInfo);

                        if (!nextBlockInfo.isSelfClosing) {
                            stackLevel++;
                        }
                    }
                }

                // Modify the buffer to subtract this tag, and add it to the tag's content buffer
                bufferContent += bufferRemainder.substr(0, nextBlockIdx + nextBlockLen);
                bufferRemainder = bufferRemainder.substr(nextBlockIdx + nextBlockLen);
            }

            if (!closingTagFound) {
                if (options.throwErrors) {
                    throw new Error(`Malformatted shortcode: Unexpected end of input. Expected closing tag: ${closingTagExpected}`);
                } else {
                    return false;
                }
            }

            shortcode.content = bufferContent;
            shortcode.codeText = openBlockTextFull + shortcode.content + closingTagExpected;
        } else {
            let offsetFromEnd = 0;

            if (!shortcode.isSelfClosing) {
                let closingTagIdx = input.indexOf(closingTagExpected);

                if (closingTagIdx === -1) {
                    if (options.throwErrors) {
                        throw new Error(`Malformatted shortcode: Expected closing tag: ${closingTagExpected}`);
                    } else {
                        return false;
                    }
                }

                offsetFromEnd = (input.length - closingTagExpected.length) - closingTagIdx;

                shortcode.content = input.substr(openBlockStartIdx + openBlockTextFull.length, (input.length - openBlockTextFull.length - closingTagExpected.length - offsetFromEnd));
                shortcode.codeText = input.substr(openBlockStartIdx, input.length - offsetFromEnd);
            } else {
                shortcode.content = null;
                shortcode.codeText = input.substr(openBlockStartIdx, openBlockTextFull.length);
            }
        }

        return shortcode;
    },

    tokenizeOpenBlock(shortcode, openBlockInner, options) {
        // First, determine if block is self closing or not
        let selfCloseIdx = openBlockInner.lastIndexOf(ShortcodeParser.T_TAG_CLOSER);

        if (selfCloseIdx === openBlockInner.length - 1) {
            // Last character before closing tag is the self-closing indicator
            // Mark shortcode as self closing, and remove the closer token from our buffer
            shortcode.isSelfClosing = true;
            openBlockInner = openBlockInner.substr(0, openBlockInner.length - 1).trim();
        }

        // Start tokenization process
        let buffer = "";

        let readingName = true;
        let readingPropName = false;
        let readingPropVal = false;
        let readingPropValLiteral = false;
        let escapingInLiteral = false;

        let properties = {};

        let currentPropKey = null;

        for (let index = 0; index <= openBlockInner.length; index++) {
            let nextToken = openBlockInner[index];
            let nothingLeft = (typeof nextToken === "undefined");

            if (!escapingInLiteral) {
                if (readingName) {
                    if (nothingLeft || nextToken === ShortcodeParser.T_TAG_PROPERTY_SEPARATOR) {
                        // We are finished reading the tag name, next is a property name or end of tag
                        shortcode.name = buffer;

                        buffer = "";

                        readingName = false;
                        readingPropName = true;

                        if (options.mode === ShortcodeParser.MODE_GET_OPENING_TAG_NAME) {
                            return;
                        }

                        continue;
                    }
                } else if (readingPropName) {
                    if (nothingLeft || nextToken === ShortcodeParser.T_TAG_PROPERTY_SEPARATOR || nextToken === ShortcodeParser.T_TAG_PROPERTY_ASSIGN) {
                        // The tag or prop ends here (prop with no value), or a separator token was found to start the value
                        if (buffer.length) {
                            currentPropKey = buffer;
                            properties[currentPropKey] = null;

                            buffer = "";

                            readingPropName = false;
                            readingPropVal = true;
                            readingPropValLiteral = false;
                        }

                        continue;
                    }
                } else if (readingPropVal) {
                    if (nextToken === ShortcodeParser.T_TAG_PROPERTY_VALUE_ESCAPE) {
                        escapingInLiteral = true;
                        continue;
                    }

                    let literalClosed = false;

                    if (nextToken === ShortcodeParser.T_TAG_PROPERTY_VALUE_WRAPPER) {
                        // T_TAG_PROPERTY_VALUE_WRAPPER is a character that wraps around a property value to denote a string
                        // literal, which enables the use of spaces etc within the value.
                        if (buffer.length === 0) {
                            // Buffer empty, we must be opening the literal
                            if (readingPropValLiteral) {
                                literalClosed = true;
                                readingPropValLiteral = false;
                            } else {
                                readingPropValLiteral = true;
                                continue;
                            }
                        } else {
                            // Buffer not empty, we must be closing the literal
                            if (!readingPropValLiteral) {
                                if (options.throwErrors) {
                                    throw new Error('Unexpected T_TAG_PROPERTY_VALUE_WRAPPER (expected a prior start marker)');
                                } else {
                                    return false;
                                }
                            } else {
                                literalClosed = true;
                                readingPropValLiteral = false;
                            }
                        }
                    }

                    if (!readingPropValLiteral && (literalClosed || nothingLeft || nextToken === ShortcodeParser.T_TAG_PROPERTY_SEPARATOR)) {
                        // The tag or value ends here, or the next property begins
                        if (buffer.length || literalClosed) {
                            properties[currentPropKey] = buffer;
                            currentPropKey = null;

                            buffer = "";

                            readingPropName = true;
                            readingPropVal = false;
                            readingPropValLiteral = false;
                        }

                        continue;
                    }
                }
            }

            if (!nothingLeft) {
                buffer = buffer + nextToken;
                escapingInLiteral = false;
            }
        }

        if (buffer.length > 0) {
            if (options.throwErrors) {
                throw new Error('Malformatted shortcode: Invalid opening tag');
            } else {
                return false;
            }
        }

        shortcode.properties = properties;

        if (!shortcode.isSelfClosing && options.selfClosingTags.indexOf(shortcode.name) > -1) {
            // Explicitly listed in options as a naughty, misbehaving self-closing tag
            // This is one unfortunate scenario where we simply cannot parse blindly :-(
            shortcode.isSelfClosing = true;
        }
    }
};

ShortcodeParser.T_TAG_BLOCK_START = "[";
ShortcodeParser.T_TAG_BLOCK_END = "]";
ShortcodeParser.T_TAG_CLOSER = "/";
ShortcodeParser.T_TAG_PROPERTY_ASSIGN = "=";
ShortcodeParser.T_TAG_PROPERTY_SEPARATOR = " ";
ShortcodeParser.T_TAG_PROPERTY_VALUE_WRAPPER = '"';
ShortcodeParser.T_TAG_PROPERTY_VALUE_ESCAPE = "\\";

ShortcodeParser.MODE_NORMAL = 'normal';
ShortcodeParser.MODE_GET_OPENING_TAG_NAME = 'tag_name';

ShortcodeParser.DEFAULT_OPTIONS = {
    /**
     * Parser mode to operate under.
     *
     * @type string
     */
    mode: ShortcodeParser.MODE_NORMAL,

    /**
     * Offset to begin parsing from, relative to input string.
     *
     * @type int
     */
    offset: 0,

    /**
     * If true, throw errors if there is a syntax problem.
     * If false, return false and fail silently.
     *
     * @type boolean
     */
    throwErrors: true,

    /**
     * If true, perform recursive parsing for each tag.
     * This will ensure that the tag hierarchy is correctly understood, but more performance heavy.
     *
     * Precise mode is more accurate, but more performance heavy and breaks easier if shortcode syntax is unpredictable.
     *
     * @type boolean
     */
    precise: false,

    /**
     * A list of tag names that the parser always treats as self closing, without content or closing tag.
     * This needs to be supplied if self-closing tags do not include the "[selfcloser/]" style syntax.
     *
     * @type array
     */
    selfClosingTags: []
};

module.exports = ShortcodeParser;
