import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DialogEvent } from '../../../../components/dialog';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { IOrder } from '../../model';
import { ShopService } from '../shop.service';

@Component({
    standalone: false,
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public items: IOrder[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal({
        series_number: '',
        status: '0',
        page: 1,
        per_page: 20,
        keywords: '',
        user: '',
        start_at: '',
        end_at: '',
        conginee: '',
        tel: '',
        address: '',
    }));
    public statusItems: IItem[] = [
        {name: '待支付', value: 10},
        {name: '支付中', value: 12},
        {name: '待收货', value: 40},
        {name: '已完成', value: 80},
        {name: '已取消', value: 1},
        {name: '已失效', value: 2},
        {name: '待发货', value: 20},
        {name: '待评价', value: 60},
        {name: '已退款', value: 81}
    ];
    public panelOpen = false;

    public readonly shipForm = form(signal({
        fee: 0,
    }));

    constructor() {
        this.tapRefresh();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }


    public tapShip(modal: DialogEvent, item: IOrder) {
        this.shipForm.fee().value.set(item.shipping_fee);
        modal.open(() => {
            this.service.orderSave({
                id: item.id,
                operate: 'fee',
                shipping_fee: this.shipForm.fee().value()
            }).subscribe({
                next: res => {
                    this.toastrService.success('修改成功');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        });
    }
    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.title + '”订单？', () => {
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
        this.service.orderList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

}
