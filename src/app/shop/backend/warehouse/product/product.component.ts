import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
    public editData: IWarehouseLog;

    constructor(
        private service: WarehouseService,
        private toastrService: ToastrService,
        private route: ActivatedRoute,
        private modalService: NgbModal,
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

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    public onProductChange(event: any) {
        this.editData.goods_id = event.item.id,
        this.editData.product_id = event.child ? event.child.id : 0;
    }

    open(content: any, item?: IWarehouseGoods) {
        this.editData = item ? {
            goods_id: item.goods_id,
            product_id: item.product_id,
            amount: 0,
        } : {amount: 0} as any;
        this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title'
        }).result.then(_ => {
            this.service.goodsChange({
                warehouse_id: this.data.id,
                goods_id: item.goods_id,
                product_id: item.product_id,
                amount: 0,
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
