import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent } from '../../../../dialog';
import { IAccountLog } from '../../../../theme/models/auth';
import { IUser } from '../../../../theme/models/user';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-account-log',
  templateUrl: './account-log.component.html',
  styleUrls: ['./account-log.component.scss']
})
export class AccountLogComponent implements OnInit {

    public items: IAccountLog[] = [];

    public hasMore = true;

    public page = 1;

    public perPage = 20;

    public isLoading = false;

    public total = 0;

    public keywords = '';
    public user: IUser;

    public editData: IAccountLog = {} as any;

    constructor(
        private service: AuthService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (!params.user) {
                this.tapRefresh();
                return;
            }
            this.service.userAccount(params.user).subscribe(user => {
                this.user = user;
                this.tapRefresh();
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
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.accountLogList({
            keywords: this.keywords,
            page,
            per_page: this.perPage,
            user_id: this.user?.id,
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

    public tapView(modal: DialogBoxComponent, item: IAccountLog) {
        this.editData = item;
        modal.open();
    }

}
