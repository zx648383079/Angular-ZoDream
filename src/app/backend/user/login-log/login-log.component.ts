import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoginLog } from '../../../theme/models/auth';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { UserService } from '../user.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-b-login-log',
    templateUrl: './login-log.component.html',
    styleUrls: ['./login-log.component.scss']
})
export class LoginLogComponent {
    private readonly service = inject(UserService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ILoginLog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
    }));

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
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
        this.service.loginLog(queries).subscribe({
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

}
