import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IBlockItem, IExtraRule } from './model';

@Component({
  selector: 'app-rule-block',
  templateUrl: './rule-block.component.html',
  styleUrls: ['./rule-block.component.scss']
})
export class RuleBlockComponent implements OnChanges {

    @Input() public value: string;
    @Input() public rules: IExtraRule[];
    /**
     * 是否允许换行
     */
    @Input() public newLine = true;
    @Output() public tapped = new EventEmitter<IBlockItem>();

    public blcokItems: IBlockItem[];

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value || changes.rules) {
            this.blcokItems = this.renderRule(this.value, this.rules);
        }
    }

    public tapBlock(item: IBlockItem) {
        this.tapped.emit(item);
    }

    public renderRule(content: string, rules: IExtraRule[]): IBlockItem[] {
        const toBlock = (rule: IExtraRule): IBlockItem => {
            if (rule.i) {
                return {
                    type: 1,
                    content: rule.s,
                    image: rule.i,
                };
            }
            if (rule.u) {
                return {
                    type: 2,
                    content: rule.s,
                    user: rule.u,
                };
            }
            if (rule.t) {
                return {
                    type: 3,
                    content: rule.s,
                    topic: rule.t,
                };
            }
            if (rule.l) {
                return {
                    type: 4,
                    content: rule.s,
                    link: rule.l,
                };
            }
            return {content: rule.s, type: rule.type};
        };
        const splitArr = (items: IBlockItem[], rule: IExtraRule): IBlockItem[] => {
            const data: IBlockItem[] = [];
            const block = toBlock(rule);
            for (const item of items) {
                if (item.type && item.type > 0) {
                    data.push(item);
                    continue;
                }
                item.content.split(rule.s).forEach((val, i) => {
                    if (i > 0) {
                        data.push({...block});
                    }
                    if (val.length < 1) {
                        return;
                    }
                    data.push({content: val});
                });
            }
            return data;
        }
        let blockItems = [
            {content}
        ];
        if (this.newLine) {
            rules.unshift({
                s: '\n',
                type: 99,
            });
        }
        for (const rule of rules) {
            blockItems = splitArr(blockItems, rule);
        }
        return blockItems;
    }
}
