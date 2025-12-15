import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent } from '../../../../components/dialog';
import { IAdminLog } from '../../../../theme/models/auth';
import { IPageQueries } from '../../../../theme/models/page';
import { AuthService } from '../auth.service';
import { SearchService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-admin-log',
    templateUrl: './admin-log.component.html',
    styleUrls: ['./admin-log.component.scss']
})
export class AdminLogComponent implements OnInit {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IAdminLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        keywords: '',
        per_page: 20,
    }));
    public readonly editModel = signal<IAdminLog>({} as any);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.adminLogList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapView(modal: DialogBoxComponent, item: IAdminLog) {
        this.editModel.set(item);
        modal.open();
    }
}
