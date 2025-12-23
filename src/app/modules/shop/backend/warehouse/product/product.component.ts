import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { IWarehouse, IWarehouseGoods, IWarehouseLog } from '../../../model';
import { SearchService } from '../../../../../theme/services';
import { WarehouseService } from '../warehouse.service';

@Component({
    standalone: false,
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    private readonly service = inject(WarehouseService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IWarehouseGoods[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public data: IWarehouse;
    public readonly editForm = form(signal({
        id: 0,
        goods_id: 0,
        product_id: 0,
        amount: 0,
        remark: ''
    }));
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        warehouse: 0,
    }));

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
            if (this.queries.warehouse().value() < 1) {
                return;
            }
            this.service.warehouse(this.queries.warehouse).subscribe(res => {
                this.data = res;
            });
        });
    }

    public onProductChange(event: any) {
        this.editForm().value.update(v => {
            v.goods_id = event.item.id,
            v.product_id = event.child ? event.child.id : 0;
            return v;
        });
    }

    open(modal: DialogEvent, item?: IWarehouseGoods) {
        this.editForm().value.update(v => {
            v.id = 0;
            v.goods_id = item?.goods_id ?? 0,
            v.product_id = item?.product_id ?? 0;
            v.amount = 0;
            return v;
        });
        modal.open(() => {
            const data = this.editForm().value();
            this.service.goodsChange({
                warehouse_id: this.data.id,
                goods_id: data.goods_id,
                product_id: data.product_id,
                amount: data.amount,
                remark: data.remark,
            }).subscribe(_ => {
                this.toastrService.success('库存调整成功');
                this.tapPage();
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.goodsList(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['warehouse']);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }
}
