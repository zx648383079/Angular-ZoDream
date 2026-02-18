import { Component, inject, signal } from '@angular/core';
import {
    IShare
} from '../model';
import {
    DiskService
} from '../disk.service';

@Component({
    standalone: false,
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.scss']
})
export class ShareComponent {
    private readonly service = inject(DiskService);


    public readonly isChecked = signal(false);
    public readonly items = signal<IShare[]>([]);

    public page = 1;
    private hasMore = true;
    public readonly isLoading = signal(false);

    constructor() {
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.myShare({
            page
        }).subscribe({
            next: res => {
                this.page = page;
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.update(v => {
                    if (page < 2) {
                        return res.data;
                    }
                    return [...v, ...res.data];
                });
            }, 
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapFile(item: any) {
        item.checked = !item.checked;
        this.items.update(v => [...v]);
        if (!item.checked) {
            this.isChecked.set(false);
        } else {
            this.checkedIfAll();
        }
    }

    public checkedIfAll() {
        for (const item of this.items()) {
            if (!item.checked) {
                return;
            }
        }
        this.isChecked.set(true);
    }

    public tapCheckAll() {
        this.isChecked.update(v => !v);
        const isChecked = this.isChecked();
        for (const item of this.items()) {
            item.checked = isChecked;
        }
    }

}
