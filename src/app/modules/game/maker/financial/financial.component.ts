import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IGameFinancial } from '../../model';
import { GameMakerService } from '../game-maker.service';

@Component({
    standalone: false,
    selector: 'app-maker-financial',
    templateUrl: './financial.component.html',
    styleUrls: ['./financial.component.scss']
})
export class FinancialComponent {
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IGameFinancial[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
    }));

    constructor() {
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
        // this.service.forumList(queries).subscribe({
        //     next: res => {
        //         this.isLoading.set(false);
        //         this.items.set(res.data);
        //         this.hasMore = res.paging.more;
        //         this.total.set(res.paging.total);
        //         this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        //     },
        //     error: () => {
        //         this.isLoading.set(false);
        //     }
        // });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IGameFinancial) {
        this.toastrService.confirm('确定删除“' + item.name + '”土著？', () => {
            // this.service.forumRemove(item.id).subscribe(res => {
            //     if (!res.data) {
            //         return;
            //     }
            //     this.toastrService.success($localize `Delete Successfully`);
            //     this.items = this.items.filter(it => {
            //         return it.id !== item.id;
            //     });
            // });
        });
    }

}
