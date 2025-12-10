import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { ShopService } from '../../shop.service';
import { IOrderRefund } from '../../model';

@Component({
    standalone: false,
  selector: 'app-price-protect',
  templateUrl: './price-protect.component.html',
  styleUrls: ['./price-protect.component.scss']
})
export class PriceProtectComponent implements OnInit {
    private service = inject(ShopService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);
    private searchService = inject(SearchService);

    public title = '价格保护';
    public items: IOrderRefund[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确认删除此“' + item.id + '”记录？', () => {
            // this.service.subscribeRemove(item.id).subscribe(res => {
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

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {... this.queries, page};
        // this.service.orderList(queries).subscribe(res => {
        //     this.isLoading = false;
        //     this.items = res.data;
        //     this.hasMore = res.paging.more;
        //     this.total = res.paging.total;
        //     this.searchService.applyHistory(this.queries = queries);
        // });
    }

}
