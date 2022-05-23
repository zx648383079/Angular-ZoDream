import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { DialogBoxComponent } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { IWarehouse, IWarehouseGoods, IWarehouseLog } from '../../../model';
import { applyHistory, getQueries } from '../../../../../theme/query';
import { WarehouseService } from '../warehouse.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    public items: IWarehouseGoods[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public data: IWarehouse;
    public editData: IWarehouseLog = {} as any;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        warehouse: 0,
    };

    constructor(
        private service: WarehouseService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.queries.warehouse = parseInt(params.id, 10);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
            if (this.queries.warehouse < 1) {
                return;
            }
            this.service.warehouse(this.queries.warehouse).subscribe(res => {
                this.data = res;
            });
        });
    }

    public onProductChange(event: any) {
        this.editData.goods_id = event.item.id,
        this.editData.product_id = event.child ? event.child.id : 0;
    }

    open(modal: DialogBoxComponent, item?: IWarehouseGoods) {
        this.editData = item ? {
            id: 1,
            goods_id: item.goods_id,
            product_id: item.product_id,
            amount: 0,
        } : {amount: 0} as any;
        modal.open(() => {
            this.service.goodsChange({
                warehouse_id: this.data.id,
                goods_id: this.editData.goods_id,
                product_id: this.editData.product_id,
                amount: this.editData.amount,
                remark: this.editData.remark,
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
        const queries = {...this.queries, page};
        this.service.goodsList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }
}
