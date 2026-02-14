import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { CateringService } from '../catering.service';
import { ICateringCategory, ICateringProduct } from '../model';
import { IPageQueries } from '../../../theme/models/page';

@Component({
    standalone: false,
    selector: 'app-catering-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.scss']
})
export class StoreComponent {
    private readonly service = inject(CateringService);


    public categories: ICateringCategory[] = [];
    public readonly items = signal<ICateringProduct[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        category: 0,
        page: 1,
        per_page: 20
    }));

    constructor() {
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
            if (this.categories.length > 0) {
                this.tapCategory(this.categories[0]);
            }
        });
    }

    public tapCategory(item: ICateringCategory) {
        this.queries.category().value.set(item.id);
        this.tapRefresh();
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


    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.productList(queries).subscribe({
            next: res => {
                this.items.set(page > 1 ? [].concat(this.items, res.data) : res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
