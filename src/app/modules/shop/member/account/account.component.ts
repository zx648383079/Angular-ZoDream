import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../shop.service';
import { IAccountLog } from '../../../../theme/models/auth';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { Store } from '@ngrx/store';
import { ShopAppState } from '../../shop.reducer';
import { IUser } from '../../../../theme/models/user';
import { Subscription } from 'rxjs';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';

@Component({
    standalone: false,
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
    private service = inject(ShopService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);
    private store = inject<Store<ShopAppState>>(Store);


    public title = '我的账户';
    public items: IAccountLog[] = [];
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        type: 0,
    };
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public user: IUser;
    private subItems = new Subscription();

    constructor() {
        this.subItems.add(
            this.store.select(selectAuthUser).subscribe(res => {
                this.user = res;  
            })
        );
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }

    public tapType(i: number) {
        if (this.queries.type === i) {
            return;
        }
        this.queries.type = i;
        this.tapRefresh();
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.accountLog(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}
