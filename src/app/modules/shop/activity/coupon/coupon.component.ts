import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IErrorResult, IPageQueries } from '../../../../theme/models/page';
import { ICoupon } from '../../model';
import { SearchService } from '../../../../theme/services';
import { ThemeService } from '../../../../theme/services';
import { ActivityService } from '../activity.service';

@Component({
    standalone: false,
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

    public items: ICoupon[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };

    constructor(
        private service: ActivityService,
        private toastrService: DialogService,
        private themeService: ThemeService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
        this.themeService.setTitle('领券中心');
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapReceive(item: ICoupon) {
        this.service.couponReceive(item.id).subscribe(_ => {
            item.can_receive = false;
            this.toastrService.success('领取成功');
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
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.couponList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.searchService.applyHistory(this.queries = queries);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }
}
