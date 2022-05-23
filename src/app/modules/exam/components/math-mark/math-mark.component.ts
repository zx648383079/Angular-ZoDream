import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MathMarkParser } from './parser';

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
    @Input() public allowMath = true;
    @Input() public editable = true;
    public items: IMarkItem[] = [];
    @Output() public valueChange = new EventEmitter<string[]>();

    private parser: MathMarkParser = new MathMarkParser(this.sanitizer);

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
        this.parser.option = {
            input: this.allowInput,
            math: this.allowMath,
        };
        this.items = this.parser.render(this.content);
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
