import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IButton } from '../../../../components/form';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { AppStoreService } from '../../app-store.service';
import { ISoftwareLog } from '../../model';

@Component({
    standalone: false,
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
    private readonly service = inject(AppStoreService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public buttonItems: IButton[] = [
        {name: 'Open', icon: 'icon-folder-open-o', color: 'btn-primary'},
        {name: 'Download', icon: 'icon-download', color: 'btn-info'},
        {name: 'Share', icon: 'icon-share-alt'},
        {name: 'Write a comment', icon: 'icon-edit'},
        {name: 'Uninstall', icon: 'icon-trash'},
    ];
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    public readonly items = signal<ISoftwareLog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);

    constructor() {
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

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.logList(queries).subscribe({
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
