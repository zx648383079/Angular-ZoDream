import { Component, OnChanges, SimpleChanges, inject, input } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { mapFormat } from '../../../../theme/utils';
import { AppStoreService } from '../../app-store.service';
import { FileTypeItems, ISoftwareVersion } from '../../model';

@Component({
    standalone: false,
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnChanges {
    service = inject(AppStoreService);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public items: ISoftwareVersion[] = [];
    public subtotal: any;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        sort: 'created_at',
        order: 'desc',
    };
    private booted = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.init && changes.init.currentValue && this.itemId() > 0 && this.booted !== this.itemId()) {
            this.boot();
        }
    }

    private boot() {
        this.booted = this.itemId();
        if (this.itemId() < 1) {
            return;
        }
        this.tapRefresh();
    }

    public formatType(val: number) {
        return mapFormat(val, FileTypeItems);
    }
    
    public tapSort(sort: string) {
        this.queries.order = sort;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.versionList({...queries, software: this.itemId()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.queries = queries;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
