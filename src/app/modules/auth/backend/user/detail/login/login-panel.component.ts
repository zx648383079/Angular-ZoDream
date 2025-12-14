import { Component, effect, inject, input } from '@angular/core';
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
    private searchService = inject(SearchService);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public items: ILoginLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
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

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.loginLogList({...queries, user: this.itemId()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.queries = queries;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
