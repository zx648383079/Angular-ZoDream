import { Component, inject, signal } from '@angular/core';
import {
    IDisk
} from '../model';
import {
    DiskService
} from '../disk.service';

@Component({
    standalone: false,
    selector: 'app-trash',
    templateUrl: './trash.component.html',
    styleUrls: ['./trash.component.scss']
})
export class TrashComponent {
    private readonly service = inject(DiskService);


    public readonly isChecked = signal(false);
    public readonly items = signal<IDisk[]>([]);

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
        this.service.trashList({
            page
        }).subscribe({
            next: res => {
                res.data = res.data.map(i => {
                    i.icon = this.service.getIconByExt(i.file_id < 1 ? undefined : i.file?.extension);
                    return i;
                });
                this.page = page;
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(page < 2 ? res.data : [].concat(this.items, res.data));
            }, 
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapFile(item: any) {
        item.checked = !item.checked;
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
