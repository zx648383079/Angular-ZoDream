import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class AccountPanelComponent implements OnChanges {

    @Input() public itemId = 0;
    @Input() public init = false;
    public items: IAccountLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    private booted = 0;
    public editData: IAccountLog = {} as any;

    constructor(
        private service: AuthService,
        private searchService: SearchService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.init && changes.init.currentValue && this.itemId > 0 && this.booted !== this.itemId) {
            this.boot();
        }
    }

    public tapView(modal: DialogEvent, item: IAccountLog) {
        this.editData = item;
        modal.open();
    }

    private boot() {
        this.booted = this.itemId;
        if (this.itemId < 1) {
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
        this.service.accountLogList({...queries, user: this.itemId}).subscribe({
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
