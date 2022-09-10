import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IButton } from '../../../../components/form';
import { IPageQueries } from '../../../../theme/models/page';
import { applyHistory, getQueries } from '../../../../theme/query';
import { AppStoreService } from '../../app-store.service';
import { ISoftwareLog } from '../../model';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    public buttonItems: IButton[] = [
        {name: 'Open', icon: 'icon-folder-open-o', color: 'btn-primary'},
        {name: 'Download', icon: 'icon-download', color: 'btn-info'},
        {name: 'Share', icon: 'icon-share-alt'},
        {name: 'Write a comment', icon: 'icon-edit'},
        {name: 'Uninstall', icon: 'icon-trash'},
    ];
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public items: ISoftwareLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;

    constructor(
        private service: AppStoreService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
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
        this.service.logList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}
