import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IErrorResult } from '../../theme/models/page';
import { LegworkService } from '../legwork.service';
import { IOrder } from '../model';

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

    constructor(
        private service: LegworkService,
        private toastrService: ToastrService,
    ) { }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapPay(item: IOrder) {

    }

    public tapComment(item: IOrder) {

    }

    public tapCancel(item: IOrder) {
        if (!confirm('请确认取消此订单？')) {
            return;
        }
        this.service.orderCancel(item.id).subscribe(_ => {
            this.toastrService.success('取消成功');
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
        this.service.orderList({
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
