import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent } from '../../../../components/dialog';
import { IAccountLog } from '../../../../theme/models/auth';
import { IPageQueries } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { applyHistory, getQueries } from '../../../../theme/query';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-account-log',
  templateUrl: './account-log.component.html',
  styleUrls: ['./account-log.component.scss']
})
export class AccountLogComponent implements OnInit {

    public items: IAccountLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
        user: 0,
    };
    public user: IUser;
    public editData: IAccountLog = {} as any;

    constructor(
        private service: AuthService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
            if (!params.user) {
                return;
            }
            this.service.userAccount(params.user).subscribe(user => {
                this.user = user;
            });
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
        this.service.accountLogList(queries).subscribe({
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

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapView(modal: DialogBoxComponent, item: IAccountLog) {
        this.editData = item;
        modal.open();
    }

}
