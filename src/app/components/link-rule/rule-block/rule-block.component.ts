import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { formatLinkRule } from '../util';
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
        return formatLinkRule((rule: IExtraRule): IBlockItem => {
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
        }, content, rules, this.newLine);
    }
}
