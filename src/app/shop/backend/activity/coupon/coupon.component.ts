import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { ICoupon } from '../../../../theme/models/shop';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

    public items: ICoupon[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';

    constructor(
        private service: ActivityService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.tapRefresh();
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
        this.service.couponList({
            keywords: this.keywords,
            page,
            per_page: this.perPage
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

    public tapRemove(item: any) {
        if (!confirm('确定删除“' + item.name + '”优惠券？')) {
            return;
        }
        this.service.couponRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
