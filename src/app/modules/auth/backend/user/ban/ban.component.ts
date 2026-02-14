import { form } from '@angular/forms/signals';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../../components/dialog';
import { AppState } from '../../../../../theme/interfaces';
import { IBanAccount } from '../../../../../theme/models/auth';
import { IPageQueries } from '../../../../../theme/models/page';
import { selectAuthRole } from '../../../../../theme/reducers/auth.selectors';
import { AuthService } from '../../auth.service';
import { SearchService } from '../../../../../theme/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-auth-b-ban',
    templateUrl: './ban.component.html',
    styleUrls: ['./ban.component.scss']
})
export class BanComponent {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly searchService = inject(SearchService);
    private readonly destroyRef = inject(DestroyRef);

    public readonly items = signal<IBanAccount[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        keywords: '',
        per_page: 20,
    }));
    public editable = false;


    constructor() {
        this.store.select(selectAuthRole).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(roles => {
            this.editable = roles.indexOf('user_manage') >= 0;
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
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
        this.service.banList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IBanAccount) {
        if (!this.editable) {
            return;
        }
        this.toastrService.confirm('确定移除“' + item.item_key + '”？', () => {
            this.service.banRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
