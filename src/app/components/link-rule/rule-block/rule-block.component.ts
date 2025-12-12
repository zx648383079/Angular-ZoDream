import { Component, effect, input, output } from '@angular/core';
import { formatLinkRule } from '../util';
import { IBlockItem, IExtraRule } from './model';

@Component({
    standalone: false,
    selector: 'app-rule-block',
    templateUrl: './rule-block.component.html',
    styleUrls: ['./rule-block.component.scss']
})
export class RuleBlockComponent {

    public readonly value = input<string>(undefined);
    public readonly rules = input<IExtraRule[]>(undefined);
    /**
     * 是否允许换行
     */
    public readonly newLine = input(true);
    public readonly tapped = output<IBlockItem>();

    public blcokItems: IBlockItem[];

    constructor() {
        effect(() => {
            this.blcokItems = this.renderRule(this.value(), this.rules());
        });
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
        }, content, rules, this.newLine());
    }
}
