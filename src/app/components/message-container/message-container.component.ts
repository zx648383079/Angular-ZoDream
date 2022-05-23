import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { IBlockItem } from '../link-rule';
import { formatAgo } from '../../theme/utils';
import { IMessageBase } from './model';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent {

    @Input() public items: IMessageBase[] = [];
    @Input() public hasMore = false;
    @Input() public maxTime = 600000;
    @Input() public currentId: string|number;
    @Output() public loadMore = new EventEmitter<number>();
    @Output() public tapped = new EventEmitter<IBlockItem>();

    private minId = 0;

    constructor(
        private element: ElementRef<HTMLDivElement>
    ) { }

    get formatItems() {
        if (this.items.length < 1) {
            return [];
        }
        const sortItems = this.items;
        sortItems.sort((a, b) => {
            a.created_at = this.formatTime(a.created_at);
            b.created_at = this.formatTime(b.created_at);
            if (a.created_at < b.created_at) {
                return -1;
            }
            if (a.created_at > b.created_at) {
                return 1;
            }
            return 0;
        });
        this.minId = this.items[0].id;
        const items = [];
        let lastTime: Date;
        const now = new Date();
        const exist = [];
        for (const item of sortItems) {
            if (item.id && exist.indexOf(item.id) >= 0) {
                continue;
            }
            const time = this.formatTime(item.created_at);
            if (!lastTime || this.diffTime(time, lastTime) > this.maxTime) {
                lastTime = time;
                items.push({
                    type: 99,
                    content: formatAgo(time, now)
                });
            }
            if (item.id) {
                exist.push(item.id);
            }
            if (!item.extra_rule) {
                item.extra_rule = [];
            } else if (typeof item.extra_rule === "string") {
                item.extra_rule = JSON.parse(item.extra_rule);
            }
            items.push(item);
        }
        return items;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this.scrollBottom();
        }
    }

    public getMediaSource(item: IMessageBase) {
        if (!item.extra_rule || item.extra_rule.length < 1) {
            return item.content;
        }
        const rule = item.extra_rule[0];
        if (item.type === 1) {
            return rule.i;
        }
        if (item.type === 2 || item.type === 3) {
            return rule.f;
        }
        return rule.s;
    }

    public onRuleTap(item: any) {
        this.tapped.emit(item);
    }

    public tapNewsItem(item: any) {
        this.tapped.emit({...item, type: 80});
    }

    public tapDownFile(item: IMessageBase) {
        if (!item.extra_rule || item.extra_rule.length < 1) {
            return;
        }
        const rule = item.extra_rule[0];
        this.tapped.emit({
            type: 5,
            content: item.content,
            file: rule.f
        });
    }

    public messageIsUser(item: IMessageBase) {
        return item.user && item.user.id > 0 && this.currentId === item.user.id;
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.loadMore.emit(this.minId);
    }

    public scrollBottom() {
        setTimeout(() => {
            const ele = this.element.nativeElement;
            ele.scrollTo({
                top: ele.clientHeight + 300
            });
        }, 100);
    }

    /**
     * 新发送的追加到前面
     * @param items 
     */
    public prepend(items: IMessageBase[]) {
        if (items && items.length > 0) {
            this.items = [].concat(items, this.items);
        }
    }

    /**
     * 历史记录加载到后面
     * @param items 
     */
    public append(items: IMessageBase[]) {
        if (items && items.length > 0) {
            this.items = [].concat(this.items, items);
        }
    }

    private formatTime(date: any): Date {
        if (typeof date === 'number') {
            return new Date(date * 1000);
        }
        if (typeof date === 'string') {
            return new Date(/^\d+$/.test(date) ? parseInt(date, 10) * 1000 : date);
        }
        return date;
    }

    private diffTime(current: Date, last: Date): number {
        return Math.abs(current.getTime() - last.getTime());
    }

}
