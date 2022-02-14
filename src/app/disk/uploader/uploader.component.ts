import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { formatDate, mapFormat } from '../../theme/utils';

export interface IUploadItem {
    name: string;
    progress: number;
    total: number;
    status: number;
    created_at: any;
    md5?: string;
    speed?: number;
    style?: any;
    checked?: boolean;
    lastAt?: number;
}

interface IUploadGroup {
    name: string;
    items: IUploadItem[];
}

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnChanges {

    @Input() public title = '上传';
    public min = false;
    public visible = false;
    @Input() public items: IUploadItem[] = [];
    public formatedItems: IUploadGroup[] = [];
    @Input() public maxTime = 86400000;
    @Output() public uploading = new EventEmitter<File[]>();

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.items) {
            this.formatedItems = this.format(changes.items.currentValue);
        }
    }

    public formatStatus(val: number) {
        return mapFormat(val, ['', '队列中', '已暂停', '文件校验中', '校验完成', '文件上传中', '秒传', '已完成', '失败', '已取消']);
    }

    public uploadFile(files: File[]) {
        this.uploading.emit(files);
    }

    public append(items: IUploadItem[]|IUploadItem) {
        if (items instanceof Array) {
            this.items.push(...items);
        } else {
            this.items.push(items);
        }
        this.formatedItems = this.format(this.items);
    }

    public tapRemove(item: IUploadItem) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i] === item) {
                this.items.splice(i);
            }
        }
        this.formatedItems = this.format(this.items);
    }

    private format(items: IUploadItem[]): IUploadGroup[] {
        if (items.length < 1) {
            return [];
        }
        items.sort((a, b) => {
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
        const res: IUploadGroup[] = [];
        let lastTime: Date;
        let lastGroup: IUploadGroup;
        for (const item of items) {
            const time = this.formatTime(item.created_at);
            if (!lastTime || this.diffTime(time, lastTime) > this.maxTime) {
                lastTime = time;
                lastGroup = {
                    name: formatDate(time, 'yyyy-mm-dd'),
                    items: [],
                };
                res.push(lastGroup);
            }
            this.formatProgress(item);
            lastGroup.items.push(item);
        }
        return res;
    }

    public formatProgress(item: IUploadItem, progress = -1) {
        if (progress >= 0) {
            const last = item.lastAt;
            const now = new Date().getTime();
            item.lastAt = now;
            if (last) {
                item.speed = Math.ceil(Math.max(0, progress - item.progress) * 1000 / (now - last));
            }
            item.progress = progress;
        }
        item.style = {
            width: item.total > 0 ? (item.progress * 100 / item.total) + '%' : 0,
        };
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
