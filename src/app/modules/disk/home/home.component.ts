import { Component, inject, signal } from '@angular/core';
import {
    IShare
} from '../model';
import {
    DiskService
} from '../disk.service';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private readonly service = inject(DiskService);


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
        this.service.shareList({
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

}