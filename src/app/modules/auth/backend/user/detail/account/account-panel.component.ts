import { form } from '@angular/forms/signals';
import { Component, effect, inject, input, signal } from '@angular/core';
import { IAccountLog } from '../../../../../../theme/models/auth';
import { IPageQueries } from '../../../../../../theme/models/page';
import { AuthService } from '../../../auth.service';
import { DialogEvent } from '../../../../../../components/dialog';
import { SearchService } from '../../../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-log-account-panel',
    templateUrl: './account-panel.component.html',
    styleUrls: ['./account-panel.component.scss']
})
export class AccountPanelComponent {
    private readonly service = inject(AuthService);
    private readonly searchService = inject(SearchService);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public items: IAccountLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    private booted = 0;
    public editData: IAccountLog = {} as any;



    constructor() {
        effect(() => {
            if (this.init() && this.itemId() > 0 && this.booted !== this.itemId()) {
                this.boot();
            }
        });
    }

    public tapView(modal: DialogEvent, item: IAccountLog) {
        this.editData = item;
        modal.open();
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.accountLogList({...queries, user: this.itemId()}).subscribe({
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
