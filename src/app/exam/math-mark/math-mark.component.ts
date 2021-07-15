import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as katex from 'katex';
import AsciiMathParser from 'asciimath2tex';

interface IMarkItem {
    type: string;
    content?: any;
    value?: string;
    rightValue?: string;
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
        const pushMath = () => {
            index ++;
            start = index;
            while (index < content.length - 1) {
                if (content.charAt(++index) === '$'  && backslashedCount(index - 1) % 2 === 0) {
                    break;
                }
            }
            items.push({
                type: 'math',
                content: this.sanitizer.bypassSecurityTrustHtml(
                    katex.renderToString(parser.parse(content.substring(start, index)))
                )
            });
            index ++;
        };
        const pushText = (end: number) => {
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

        while (index < content.length - 1) {
            const code = content.charAt(++index);
            if (this.allowInput && code === '_' && content.substr(index, 3) === '___') {
                pushText(index - 1);
                pushInput();
                start = index;
                continue;
            }
            if (code === '$' && backslashedCount(index - 1) % 2 === 0) {
                pushText(index - 1);
                pushMath();
                start = index;
                continue;
            }
            if (code === '\n') {
                pushText(index - 1);
                items.push({
                    type: 'line',
                });
                start = index;
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
