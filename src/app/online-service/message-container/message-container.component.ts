import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IMessage } from '../model';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent implements OnChanges {

    @ViewChild('messageBox')
    public messageEf: ElementRef<HTMLDivElement>;

    @Input() public items: any[] = [];
    @Input() public hasMore = false;
    @Input() public timeKey = 'created_at';
    @Input() public maxTime = 600000;
    @Input() public currentId: string|number;
    @Output() public loadMore = new EventEmitter();

    constructor() { }

    get formatItems() {
        const items = [];
        let lastTime: Date;
        const now = new Date();
        for (const item of this.items) {
            const time = this.formatTime(item[this.timeKey]);
            if (!lastTime || this.diffTime(time, lastTime) > this.maxTime) {
                lastTime = time;
                items.push({
                    type: 99,
                    content: this.formatAgo(time, now)
                });
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

    public messageIsUser(item: IMessage) {
        if (!this.currentId || this.currentId < 1) {
            return item.send_type < 1;
        }
        return this.currentId === item.user_id;
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.loadMore.emit();
    }

    public scrollBottom() {
        setTimeout(() => {
            const ele = this.messageEf.nativeElement;
            ele.scrollTo({
                top: ele.clientHeight
            });
        }, 100);
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

    private formatAgo(date: Date, now?: Date): string {
        if (!now) {
            now = new Date();
        }
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diff < 1) {
            return '刚刚';
        }
        if (diff < 60) {
            return diff + '秒前';
        }
        if (diff < 3600) {
            return Math.floor(diff / 60) + '分钟前';
        }
        if (diff < 86400) {
            return Math.floor(diff / 3600) + '小时前';
        }
        if (diff < 2592000) {
            return Math.floor(diff / 86400) + '天前';
        }
        if (date.getFullYear() === now.getFullYear()) {
            return date.getMonth() + 1 + '月' + date.getDate();
        }
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
    }
}
