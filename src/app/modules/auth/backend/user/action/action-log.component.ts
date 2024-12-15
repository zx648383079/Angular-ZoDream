import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IActionLog } from '../../../../../theme/models/auth';
import { IPageQueries } from '../../../../../theme/models/page';
import { AuthService } from '../../auth.service';
import { SearchService } from '../../../../../theme/services';

@Component({
    standalone: false,
  selector: 'app-action-log',
  templateUrl: './action-log.component.html',
  styleUrls: ['./action-log.component.scss']
})
export class ActionLogComponent implements OnInit {

    public items: IActionLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
        user: 0,
    };

    constructor(
        private service: AuthService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }


    /**
    * tapRefresh
    */
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
        this.service.actionLogList(queries).subscribe({
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

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

}
