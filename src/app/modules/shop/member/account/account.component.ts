import { form } from '@angular/forms/signals';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../shop.service';
import { IAccountLog } from '../../../../theme/models/auth';
import { SearchService } from '../../../../theme/services';
import { Store } from '@ngrx/store';
import { ShopAppState } from '../../shop.reducer';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent {
    private readonly service = inject(ShopService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly store = inject<Store<ShopAppState>>(Store);
    private readonly destroyRef = inject(DestroyRef);


    public title = '我的账户';
    public readonly items = signal<IAccountLog[]>([]);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
        type: 0,
    }));
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public user: IUser;

    constructor() {
        this.store.select(selectAuthUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            this.user = res;
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapType(i: number) {
        if (this.queries.type().value() === i) {
            return;
        }
        this.queries.type().value.set(i);
        this.tapRefresh();
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.accountLog(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }
}
