import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { AppStoreService } from '../../app-store.service';
import { ISoftwareDownload } from '../../model';

@Component({
    standalone: false,
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
    private readonly service = inject(AppStoreService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    public readonly items = signal<ISoftwareDownload[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.appCheck(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    private formatStyle(item: ISoftwareDownload, progress = -1) {
        if (item.status < 1) {
            item.style = {};
            return item;
        }
        if (progress >= 0) {
            const last = item.last_time;
            const now = new Date().getTime();
            item.last_time = now;
            if (last) {
                item.speed = Math.ceil(Math.max(0, progress - item.progress) * 1000 / (now - last));
            }
            item.progress = progress;
        }
        item.style = {
            width: item.length > 0 ? (item.progress * 100 / item.length) + '%' : 0,
        };
    }

}
