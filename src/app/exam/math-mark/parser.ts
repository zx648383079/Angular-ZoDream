import { DomSanitizer } from '@angular/platform-browser';
import { CharIterator } from '../../theme/char';
import * as katex from 'katex';
import AsciiMathParser from 'asciimath2tex';

export interface IMarkItem {
    type: 'text'|'input'|'image'|'line'|'math';
    content?: any;
    value?: string;
    rightValue?: string;
    size?: number;
}

export interface IMatchParserOption {
    input?: boolean;
    math?: boolean;
}

export class MathMarkParser {

    constructor(
        private sanitizer: DomSanitizer,
        public option: IMatchParserOption = {},
    ) {
    }

    private asciiMath = new AsciiMathParser();

    public render(content: string): IMarkItem[] {
        const reader = new CharIterator(content.toString().trim());
        const items: IMarkItem[] = [];
        let text = '';
        const pushText = () => {
            if (text.length < 0) {
                return;
            }
            items.push({
                type: 'text',
                content: text,
            });
            text = '';
        };
        while (reader.moveNext()) {
            const code = reader.current;
            if (code === '\n') {
                pushText();
                items.push({
                    type: 'line',
                });
                continue;
            }
            if ((!this.option.input || code !== '_') && code !== '!' && (!this.option.math || code !== '$')) {
                text += code;
                continue;
            }
            if (!this.codeIsValid(reader)) {
                text = text.substr(0, text.length - 1) + code;
                continue;
            }
            const block = this.renderNext(reader);
            if (!block) {
                text += code;
                continue;
            }
            pushText();
            items.push(block);
        }
        pushText();
        return items;
    }

    private renderNext(reader: CharIterator): IMarkItem|undefined {
        switch (reader.current) {
            case '_':
                return this.renderInput(reader);
            case '$':
                return this.renderMath(reader);
            case '!':
                return this.renderImage(reader);
        }
        return;
    }

    private renderInput(reader: CharIterator): IMarkItem|undefined {
        if (!reader.nextIs('__')) {
            return;
        }
        let count = 3;
        reader.move(2);
        while (reader.moveNext()) {
            if (reader.current === '_') {
                count ++;
                continue;
            }
            reader.position --;
            break;
        }
        return {
            type: 'input',
            value: '',
            size: count,
        };
    }

    private renderMath(reader: CharIterator): IMarkItem|undefined {
        const isBlock = reader.nextIs('$');
        const offset = isBlock ? 2 : 1;
        const i = reader.indexOf(isBlock ? '$$' : '$', offset);
        if (i < 0) {
            return;
        }
        const content = reader.read(i - reader.position - offset, offset);
        reader.position = i + offset - 1;
        return {
            type: 'math',
            content: this.sanitizer.bypassSecurityTrustHtml(
                katex.renderToString(this.asciiMath.parse(content), {
                    displayMode: isBlock,
                })
            )
        };
    }

    private renderImage(reader: CharIterator): IMarkItem|undefined {
        if (!reader.nextIs('[](')) {
            return;
        }
        const i = reader.indexOf(')', 3);
        if (i < 0) {
            return;
        }
        const content = reader.read(i - reader.position - 3, 3);
        reader.position = i;
        return {
            type: 'image',
            content,
        };
    }

    /**
     * 判断当前字符是否有效，没有被 \ 转义
     * @param i 
     * @returns 
     */
    private codeIsValid(reader: CharIterator): boolean {
        return reader.reverseCount('\\') % 2 === 0;
    }
}