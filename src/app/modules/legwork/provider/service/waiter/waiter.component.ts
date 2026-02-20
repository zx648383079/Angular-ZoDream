import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { IUser } from '../../../../../theme/models/user';
import { SearchService } from '../../../../../theme/services';
import { LegworkService } from '../../../legwork.service';
import { IService } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-waiter',
    templateUrl: './waiter.component.html',
    styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent {
    private readonly service = inject(LegworkService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IUser[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public data: IService;

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.loadService(params.id);
        });
    }

    private loadService(id: any) {
        this.service.providerService(id).subscribe(res => {
            this.data = res;
            this.tapPage();
        });
    }

    public tapChange(item: IUser, status = 1) {
        this.service.providerWaiterChange({
            id: this.data.id,
            user_id: item.id,
            status
        }).subscribe({
            next: _ => {
                this.toastrService.success($localize `Edit successfully`);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
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
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page, id: this.data.id};
        this.service.providerWaiterList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.update(v => {
                    if (page < 2) {
                        return res.data;
                    }
                    return [...v, ...res.data];
                });
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
