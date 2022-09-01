import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoginLog } from '../../../theme/models/auth';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { UserService } from '../user.service';

@Component({
selector: 'app-login-log',
templateUrl: './login-log.component.html',
styleUrls: ['./login-log.component.scss']
})
export class LoginLogComponent implements OnInit {

    public items: ILoginLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };

    constructor(
        private service: UserService,
        private route: ActivatedRoute,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
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
        this.service.loginLog(queries).subscribe({
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
