import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as katex from 'katex';
import AsciiMathParser from 'asciimath2tex';

interface IMarkItem {
    type: string;
    content?: any;
    value?: string;
    rightValue?: string;
    line?: boolean; // 是否是单独一行
    size?: number;
}

@Component({
  selector: 'app-math-mark',
  templateUrl: './math-mark.component.html',
  styleUrls: ['./math-mark.component.scss']
})
export class MathMarkComponent implements OnChanges {

    @Input() public content = '';
    @Input() public value: string[] = [];
    @Input() public rightValue: string[] = [];
    @Input() public allowInput = false;
    @Input() public editable = true;
    public items: IMarkItem[] = [];
    @Output() public valueChange = new EventEmitter<string[]>();

    constructor(
        private sanitizer: DomSanitizer,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.content) {
            this.formatContent();
        }
        if (changes.value || changes.rightValue) {
            this.applayValue();
        }
    }

    public onInputChange() {
        this.outputValue();
    }

    private formatContent() {
        const items: IMarkItem[] = [];
        const content = this.content.trim();
        let index = -1;
        let start = 0;
        const parser = new AsciiMathParser();
        /**
         * 判断下一个字符是否是
         * @param tag 
         * @returns 
         */
        const nextIs = (tag: string): boolean => {
            if (content.length < index + tag.length) {
                return false;
            }
            return content.substr(index + 1, tag.length) === tag;
        };
        const pushMath = () => {
            const isBlock = nextIs('$');
            index += isBlock ? 2 : 1;
            start = index;
            let len = 0;
            while (index < content.length - 1) {
                len ++;
                const code = content.charAt(++index);
                if (code !== '$' || !codeIsValid()) {
                    continue;
                }
                if (!isBlock) {
                    break;
                }
                if (!nextIs('$')) {
                    continue;
                }
                index ++;
                break;
            }
            items.push({
                type: 'math',
                line: isBlock,
                content: this.sanitizer.bypassSecurityTrustHtml(
                    katex.renderToString(parser.parse(content.substr(start, len)), {
                        displayMode: isBlock,
                    })
                )
            });
        };
        const pushImage = () => {
            index += 3;
            start = index;
            while (index < content.length - 1) {
                if (content.charAt(++index) === ')' && codeIsValid()) {
                    break;
                }
            }
            items.push({
                type: 'image',
                content: content.substring(start, index)
            });
        };
        const pushText = (end: number) => {
            if (end > content.length) {
                end = content.length;
            }
            if (start >= end) {
                return;
            }
            const text = content.substring(start, end);
            if (text.length < 1) {
                return;
            }
            items.push({
                type: 'text',
                content: text,
            });
        };
        const pushInput = () => {
            start = index;
            while (index < content.length - 1) {
                if (content.charAt(++index) !== '_') {
                    index --;
                    break;
                }
            }
            items.push({
                type: 'input',
                value: '',
                size: index - start,
            });
        };
        const backslashedCount = (i: number) => {
            let count = 0;
            while (i >= 0) {
                if (content.charAt(i --) === '\\') {
                    count ++;
                    continue;
                }
                break;
            }
            return count;
        };
        /**
         * 判断当前字符是否有效，没有被 \ 转义
         * @param i 
         * @returns 
         */
        const codeIsValid = (i: number = index): boolean => {
            return backslashedCount(i - 1) % 2 === 0;
        };

        while (index < content.length - 1) {
            const code = content.charAt(++index);
            if (this.allowInput && code === '_'  && codeIsValid() && nextIs('__')) {
                pushText(index);
                pushInput();
                start = index + 1;
                continue;
            }
            if (code === '$' && codeIsValid()) {
                pushText(index);
                pushMath();
                start = index + 1;
                continue;
            }
            if (code === '!'  && codeIsValid() && nextIs('[](')) {
                pushText(index);
                pushImage();
                start = index + 1;
                continue;
            }
            if (code === '\n') {
                pushText(index);
                items.push({
                    type: 'line',
                });
                start = index + 1;
                continue;
            }
        }
        pushText(index + 1);
        this.items = items;
    }

    private applayValue() {
        const valueItems = this.formatValue(this.value);
        const rightItems = this.formatValue(this.rightValue);
        let i = 0;
        for (const item of this.items) {
            if (item.type !== 'input') {
                continue;
            }
            item.value = valueItems.length > i ? valueItems[i] : '';
            item.rightValue = rightItems.length > i ? rightItems[i] : '';
            i ++;
        }
    }

    private formatValue(value: any) {
        return value instanceof Array ? value.map((i: any) => {
            return typeof i === 'object' ? i.content : i
        }) : [];
    }

    private outputValue() {
        const items = [];
        for (const item of this.items) {
            if (item.type !== 'input') {
                continue;
            }
            items.push(item.value);
        }
        this.valueChange.emit(this.value = items);
    }
}
