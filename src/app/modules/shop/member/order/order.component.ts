import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { IOrder } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);

    public title = '我的订单';
    public items: IOrder[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public tabItems: IItem[] = [
        {
            name: '全部订单',
            value: 0,
        },
        {
            name: '待付款',
            value: 10,
        },
        {
            name: '待发货',
            value: 20,
        },
        {
            name: '待收货',
            value: 40,
        },
        {
            name: '待评价',
            value: 60,
        },
    ];
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        status: 0,
        page: 1,
        per_page: 20,
    }));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }


    public tapTab(item: IItem) {
        this.queries.status = item.value as number;
        this.tapRefresh();
    }

    public tapDetail(item: IOrder) {
        this.router.navigate([item.id], {relativeTo: this.route});
    }

    public tapPay(item: IOrder) {
        this.router.navigate(['../../market/cashier/pay', item.id], {relativeTo: this.route});
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRepurchase(item: IOrder) {
        this.service.orderRepurchase(item.id).subscribe({
            next: () => {
                this.toastrService.success('已加入购物车');
                this.router.navigate(['../../market/cart'], {relativeTo: this.route});
            },
            error: err => {
                this.toastrService.error(err);
            }
        })
    }

    public tapRemove(item: IOrder) {
        this.toastrService.confirm('确认删除此“' + item.series_number + '”订单？', () => {
            this.service.orderRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

    public tapCancel(item: IOrder) {
        this.toastrService.confirm('确认取消此“' + item.series_number + '”订单？', () => {
            this.service.orderCancel(item.id).subscribe(res => {
                this.toastrService.success('取消成功');
                this.items = this.items.map(it => {
                    return it.id !== item.id ? it : item;
                });
            });
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {... this.queries().value(), page};
        this.service.orderList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

}
