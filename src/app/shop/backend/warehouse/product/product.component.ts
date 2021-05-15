import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { DialogBoxComponent } from '../../../../dialog';
import { IWarehouse, IWarehouseGoods, IWarehouseLog } from '../../../../theme/models/shop';
import { WarehouseService } from '../warehouse.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    public items: IWarehouseGoods[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public data: IWarehouse;
    public editData: IWarehouseLog = {} as any;

    constructor(
        private service: WarehouseService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.tapRefresh();
                return;
            }
            this.data = {id: params.id} as any;
            this.service.warehouse(params.id).subscribe(res => {
                this.data = res;
            });
            this.tapRefresh();
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
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.goodsList({
            keywords: this.keywords,
            warehouse: this.data ? this.data.id : 0,
            page,
            per_page: this.perPage,
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }
}
