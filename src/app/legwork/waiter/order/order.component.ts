import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog';
import { IErrorResult } from '../../../theme/models/page';
import { LegworkService } from '../../legwork.service';
import { IOrder } from '../../model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    public items: IOrder[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public keywords = '';

    constructor(
        private service: LegworkService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }

    public tapTaken(item: IOrder) {
        if (!confirm('请确认已完成此订单？')) {
            return;
        }
        this.service.waiterTaken(item.id).subscribe(_ => {
            this.toastrService.success('结单成功');
            this.tapRefresh();
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.waiterOrderList({
            keywords: this.keywords,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
        }, () => {
            this.isLoading = false;
        });
    }

}
