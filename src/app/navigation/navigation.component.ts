import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../dialog';
import { IPageQueries } from '../theme/models/page';
import { applyHistory, getQueries } from '../theme/query';
import { IWebPage } from './model';
import { NavigationService } from './navigation.service';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    @ViewChild(ReportDialogComponent)
    public reportModal: ReportDialogComponent;

    public openType = 0;
    public items: IWebPage[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
    };

    constructor(
        private service: NavigationService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            if (!this.queries.keywords) {
                return;
            }
            this.tapPage();
        });
    }

    public tapItem(e: {type: number, data: IWebPage}) {
        if (e.type == 2) {
            this.reportModal.open(e.data);
        }
    }

    public toggleOpen() {
        if (this.openType < 1) {
            this.openType = 1;
        } else if (this.openType === 1) {
            this.openType = 0;
        } 
    }

    public tapSearch(v: string) {
        this.queries.keywords = v.trim();
        if (this.queries.keywords.length > 0) {
            this.tapRefresh();
            return;
        }
        this.openType = 0;
        applyHistory(this.queries);
    }

    public tapRefresh() {
        this.items = [];
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
        this.openType = 2;
        const queries = {...this.queries, page};
        this.service.search(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            },
            error: err => {
                this.isLoading = false;
                this.toastrService.error(err);
            },
        });
    }

}
