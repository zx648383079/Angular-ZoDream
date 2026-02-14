import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAccountLog } from '../../../../../theme/models/auth';
import { IPageQueries } from '../../../../../theme/models/page';
import { IUser } from '../../../../../theme/models/user';
import { AuthService } from '../../auth.service';
import { SearchService } from '../../../../../theme/services';
import { DialogEvent } from '../../../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-account-log',
    templateUrl: './account-log.component.html',
    styleUrls: ['./account-log.component.scss']
})
export class AccountLogComponent {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IAccountLog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        keywords: '',
        per_page: 20,
        user: 0,
    }));
    public user: IUser;
    public readonly dataModel = signal<IAccountLog>({} as any);

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
            if (!params.user) {
                return;
            }
            this.service.user(params.user).subscribe(user => {
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
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.accountLogList(queries).subscribe({
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

    public tapView(modal: DialogEvent, item: IAccountLog) {
        this.dataModel.set(item);
        modal.open();
    }

}
