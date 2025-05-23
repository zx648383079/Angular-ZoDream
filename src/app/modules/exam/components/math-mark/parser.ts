import { DomSanitizer } from '@angular/platform-browser';
import { CharIterator } from '../../../../theme/utils/char';
import * as katex from 'katex';
import AsciiMathParser from 'asciimath2tex';

export interface IMarkItem {
    type: 'text'|'input'|'image'|'line'|'math'|'table'|'underline'|'wavyline' | 'bold';
    header?: ITableTd[];
    content?: any;
    value?: string;
    rightValue?: string;
    size?: number;
}

interface ITableTd {
    items: IMarkItem[];
    align: 'left'|'center'|'right';
}

interface ITable {
    header: ITableTd[];
    items: ITableTd[][];
}

export interface IMatchParserOption {
    input?: boolean;
    math?: boolean;
}

interface IMarkRange {
    begin: string;
    end: string;
    format?: (this: MathMarkParser, v: string) => any;
}

export const MarkRangeMap: {[type: string]: IMarkRange} = {
    image: {
        begin: '![](',
        end: ')',
        format: function(v) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(v)
        }
    },
    underline: {begin: '--', end: '--'},
    wavyline: {begin: '~~', end: '~~'},
    dashed: {begin: '··', end: '··'},
    bold: {begin: 'b_', end: '_b'},
};


export class MathMarkParser {

    constructor(
        public sanitizer: DomSanitizer,
        public option: IMatchParserOption = {},
    ) {
    }

    private asciiMath = new AsciiMathParser();

    public render(content: string): IMarkItem[] {
        return this.renderInner(content);
    }

    private renderInner(content: string, defType: any = 'text'): IMarkItem[] {
        if (typeof content === 'undefined' || content === null) {
            content = '';
        }
        const reader = new CharIterator(content.toString().trim());
        const items: IMarkItem[] = [];
        let text = '';
        const pushText = () => {
            if (text.length < 0) {
                return;
            }
            items.push({
                type: defType,
                content: text,
            });
            text = '';
        };
        const pushTable = () => {
            const block = this.renderTable(reader);
            if (!block) {
                return;
            }
            items.push(block);
        }
        pushTable();
        while (reader.moveNext()) {
            const code = reader.current;
            if (code === '\n') {
                pushText();
                items.push({
                    type: 'line',
                });
                pushTable();
                continue;
            }
            if (!this.codeIsValid(reader)) {
                text = text.substring(0, text.length - 1) + code;
                continue;
            }
            const block = this.renderNext(reader);
            if (!block) {
                text += code;
                continue;
            }
            pushText();
            if (block instanceof Array) {
                items.push(...block);
                continue;
            }
            items.push(block);
        }
        pushText();
        return items;
    }

    private renderNext(reader: CharIterator): IMarkItem[]|IMarkItem|undefined {
        for (const key in MarkRangeMap) {
            if (Object.prototype.hasOwnProperty.call(MarkRangeMap, key)) {
                const element = MarkRangeMap[key];
                if (!this.isRange(reader, element)) {
                    continue;
                }
                return this.renderRange(reader, element.begin, element.end, key, element.format);
            }
        }
        switch (reader.current) {
            case '_':
                return !this.option.input ? undefined : this.renderInput(reader);
            case '$':
                return !this.option.math ? undefined : this.renderMath(reader);
        }
        return;
    }

    private isRange(reader: CharIterator, item: IMarkRange): boolean {
        if (!reader.is(0, item.begin)) {
            return false;
        }
        return reader.indexOf(item.end, item.begin.length) > 0;
    }

    private renderRange(reader: CharIterator, begin: string, end: string, name: string, cb?: (v: string) => any): IMarkItem[]|IMarkItem|undefined {
        const i = reader.indexOf(end, begin.length);
        if (i < 0) {
            return;
        }
        const content = reader.read(i - reader.position - begin.length, begin.length);
        reader.position = i + end.length - 1;
        if (cb) {
            return {
                type: name as any,
                content: cb.call(this, content),
            };
        }
        return this.renderInner(content, name);
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

    private renderTable(reader: CharIterator): IMarkItem|undefined {
        let old = reader.position;
        let line = this.readLine(reader);
        if (!line || line.indexOf('|', 1) < 0) {
            reader.position = old;
            return;
        }
        const header: ITableTd[] = this.splitTr(line).map(i => {
            return {
                items: this.render(i),
                align: 'left'
            };
        });
        line = this.readLine(reader);
        if (!line || !this.isTrAlign(line)) {
            reader.position = old;
            return;
        }
        this.splitTr(line).forEach((v, i) => {
            if (header.length <= i) {
                return;
            }
            header[i].align = this.formatAlign(v);
        });
        old = reader.position; 
        const items: ITableTd[][] = [];
        while (true) {
            line = this.readLine(reader)
            if (!line || line.indexOf('|', 1) < 0) {
                reader.position = old;
                break;
            }
            items.push(this.splitTr(line).map((text, i) => {
                return {
                    items: this.render(text),
                    align: header.length > i ? header[i].align : 'left'
                };
            }));
            old = reader.position;
        }
        return {
            type: 'table',
            header,
            content: items
        }
    }

    private formatAlign(line: string) {
        const left = line.charAt(0) === ':';
        const right = line.charAt(line.length - 1) === ':';
        if (left) {
            return right ? 'center' : 'left';
        }
        return right ? 'right' : 'left';
    }

    private isTrAlign(line: string): boolean {
        return /^[\|\:-\s]{2,}$/.test(line);
    }

    private splitTr(line: string): string[] {
        let start = 0;
        let end = line.length;
        if (line.charAt(0) === '|') {
            start = 1;
        }
        if (line.charAt(end - 1) === '|') {
            end --;
        }
        // TODO 当前只是简单的判断 | ,没有区分是否在公式中
        return line.substring(start, end).split('|').map(i => i.trim());
    }

    private readLine(reader: CharIterator): string {
        let line = '';
        while (reader.moveNext()) {
            const code = reader.current;
            if (code === '\n') {
                break;
            }
            line += code;
        }
        return line;
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