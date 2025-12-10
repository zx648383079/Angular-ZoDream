import { Component, OnInit, inject } from '@angular/core';
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
    private service = inject(AppStoreService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public items: ISoftwareDownload[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.appCheck(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
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
