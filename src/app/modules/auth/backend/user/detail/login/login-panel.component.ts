import { form } from '@angular/forms/signals';
import { Component, effect, inject, input, signal } from '@angular/core';
import { IPageQueries } from '../../../../../../theme/models/page';
import { ILoginLog } from '../../../../../../theme/models/auth';
import { AuthService } from '../../../auth.service';
import { SearchService } from '../../../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-log-login-panel',
    templateUrl: './login-panel.component.html',
    styleUrls: ['./login-panel.component.scss']
})
export class LoginPanelComponent {
    private readonly service = inject(AuthService);
    private readonly searchService = inject(SearchService);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public readonly items = signal<ILoginLog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    private booted = 0;


    constructor() {
        effect(() => {
            if (this.init() && this.itemId() > 0 && this.booted !== this.itemId()) {
                this.boot();
            }
        });
    }

    private boot() {
        this.booted = this.itemId();
        if (this.itemId() < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.loginLogList({...queries, user: this.itemId()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
