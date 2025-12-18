import { Component, effect, inject, input, model, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MathMarkParser } from './parser';
import { FormValueControl } from '@angular/forms/signals';

interface IMarkItem {
    type: string;
    content?: any;
    value?: string;
    rightValue?: string;
    line?: boolean; // 是否是单独一行
    size?: number;
    header?: any[];
}

@Component({
    standalone: false,
    selector: 'app-math-mark',
    templateUrl: './math-mark.component.html',
    styleUrls: ['./math-mark.component.scss']
})
export class MathMarkComponent implements FormValueControl<string[]>  {
    private sanitizer = inject(DomSanitizer);


    public readonly content = input('');
    public readonly value = model<string[]>([]);
    public readonly rightValue = input<string[]>([]);
    public readonly allowInput = input(false);
    public readonly allowMath = input(true);
    public readonly disabled = input(false);
    public items: IMarkItem[] = [];

    private parser: MathMarkParser = new MathMarkParser(this.sanitizer);

    constructor() {
        effect(() => {
            this.content();
            this.formatContent();
        });
        effect(() => {
            this.value();
            this.rightValue();
            this.applayValue();
        });
    }

    public onInputChange() {
        this.outputValue();
    }

    private formatContent() {
        this.parser.option = {
            input: this.allowInput(),
            math: this.allowMath(),
        };
        this.items = this.parser.render(this.content());
    }

    private applayValue() {
        const valueItems = this.formatValue(this.value());
        const rightItems = this.formatValue(this.rightValue());
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
        this.value.set(items);
    }
}
