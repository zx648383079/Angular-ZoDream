import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IEquityCard, IUserCard } from '../../../../../theme/models/auth';
import { IPageQueries } from '../../../../../theme/models/page';
import { IUser } from '../../../../../theme/models/user';
import { AuthService } from '../../auth.service';
import { SearchService } from '../../../../../theme/services';

@Component({
    standalone: false,
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private searchService = inject(SearchService);

    public items: IUserCard[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
    };
    public user: IUser;
    public editData: any = {
        card_id: 0,
        expired_at: ''
    };
    public cardItems: IEquityCard[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.user = {id: params.user} as any;
            this.service.user(params.user).subscribe(user => {
                this.user = user;
            });
        });
        this.service.cardSearch({}).subscribe(res => {
            this.cardItems = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: any) {
        this.editData = item ? Object.assign({}, item) : {
            card_id: 0,
            expired_at: '',
        };
        modal.open(() => {
            this.service.userCardUpdate({...this.editData, user_id: this.user.id}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => {
            return this.editData.card_id > 0;
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
        this.service.userCardList({...queries, user: this.user.id}).subscribe({
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

}
