import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent } from '../../../../components/dialog';
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


    public readonly items = signal<IAdminLog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.adminLogList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
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

    public tapView(modal: DialogEvent, item: IAdminLog) {
        this.editModel.set(item);
        modal.open();
    }
}
