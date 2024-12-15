import { Component, OnInit } from '@angular/core';
import { CateringService } from '../catering.service';
import { ICateringCategory, ICateringProduct } from '../model';
import { IPageQueries } from '../../../theme/models/page';

@Component({
    standalone: false,
  selector: 'app-catering-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

    public categories: ICateringCategory[] = [];
    public items: ICateringProduct[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        category: 0,
        page: 1,
        per_page: 20
    };

    constructor(
        private service: CateringService,
    ) { }

    ngOnInit() {
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
            if (this.categories.length > 0) {
                this.tapCategory(this.categories[0]);
            }
        });
    }

    public tapCategory(item: ICateringCategory) {
        this.queries.category = item.id;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.productList(queries).subscribe({
            next: res => {
                this.items = page > 1 ? [].concat(this.items, res.data) : res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
