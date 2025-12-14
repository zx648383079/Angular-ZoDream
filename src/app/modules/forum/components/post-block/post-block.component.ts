import { Component, effect, inject, input, output } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IBlockItem, IExtraRule, formatLinkRule } from '../../../../components/link-rule';

@Component({
    standalone: false,
    selector: 'app-post-block',
    templateUrl: './post-block.component.html',
    styleUrls: ['./post-block.component.scss']
})
export class PostBlockComponent {
    private readonly toastrService = inject(DialogService);


    public readonly value = input<any>(undefined);
    public readonly readable = input(true);
    public readonly tapped = output<IBlockItem>();

    public blcokItems: IBlockItem[];

    constructor() {
        effect(() => {
            this.formatContent(this.value);
        });
    }

    public tapVoteItem(block: any, item: any) {
        let count = 0;
        let items: any[] = block.items.map(i => {
            if (block.max > 1) {
                if (i === item) {
                    i.checked = !i.checked;
                }
            } else {
                i.checked = i === item;
            }
            if (i.checked) {
                count ++;
            }
            return i;
        });
        if (count > block.max) {
            for (const i of items) {
                if (!i.checked) {
                    continue;
                }
                if (i === item) {
                    continue;
                }
                i.checked = false;
                count --;
                if (count <= block.max) {
                    break;
                }
            }
        }
        block.items = items;
    }

    public tapVoteSubmit(block: any) {
        this.tapBlock(block);
    }

    private formatContent(conent: any) {
        if (!this.readable()) {
            return [];
        }
        if (typeof conent !== 'object') {
            this.blcokItems = this.renderRule(conent, []);
            return;
        }
        this.blcokItems = this.renderRule(conent.content, conent.extra_rule);
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
            if (!rule.custom) {
                return {content: rule.s, type: rule.type};
            }
            const custom: {
                [key: string]: any;
                tag: string;
                src?: string;
                href?: string;
                content?: any;
                text?: string;
                user?: number;
            } = rule.custom;
            const tag: string = custom.tag;
            if (tag === 'a') {
                return {
                    ...custom,
                    type: 4,
                    content: custom.content,
                    link: custom.href,
                };
            }
            if (tag === 'img') {
                return {
                    type: 1,
                    content: rule.s,
                    image: custom.src,
                };
            }
            return {...custom, type: 98, uid: rule.uid} as any;
        }, content, rules);
    }

}
