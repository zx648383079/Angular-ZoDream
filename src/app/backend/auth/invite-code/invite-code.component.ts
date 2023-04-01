import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IInviteCode } from '../../../theme/models/auth';
import { IPageQueries } from '../../../theme/models/page';
import { AuthService } from '../auth.service';
import { SearchService } from '../../../theme/services';

@Component({
  selector: 'app-invite-code',
  templateUrl: './invite-code.component.html',
  styleUrls: ['./invite-code.component.scss']
})
export class InviteCodeComponent implements OnInit {

    public items: IInviteCode[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public editData = {
        amount: 0,
        expired_at: '',
    };

    constructor(
        private service: AuthService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent) {
        modal.open(() => {
            this.service.inviteCodeCreate(this.editData).subscribe({
                next: res => {
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
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
        this.service.inviteCodeList(queries).subscribe({
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

    public tapClear() {
        this.toastrService.confirm('确定清除所有的邀请码？', () => {
            this.service.inviteCodeClear().subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapRefresh();
            });
        });
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除这一条邀请码？', () => {
            this.service.inviteCodeRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
