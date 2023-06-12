import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../../components/dialog';
import { UploadButtonEvent } from '../../../../../../components/form';
import { IPageQueries } from '../../../../../../theme/models/page';
import { ICouponLog } from '../../../../model';
import { SearchService } from '../../../../../../theme/services';
import { DownloadService } from '../../../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-shop-coupon-code',
  templateUrl: './coupon-code.component.html',
  styleUrls: ['./coupon-code.component.scss']
})
export class CouponCodeComponent implements OnInit {

    public items: ICouponLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        coupon: 0,
        page: 1,
        per_page: 20,
    };
    public editData = {
        amount: 1,
    };

    constructor(
        private service: ActivityService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private downloadService: DownloadService,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.coupon) {
                this.queries.coupon = parseInt(params.coupon, 10);
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapGenerate(modal: DialogEvent) {
        modal.open(() => {
            this.service.couponCodeGenerate({
                amount: this.editData.amount,
                coupon: this.queries.coupon
            }).subscribe({
                next: _ => {
                    this.toastrService.success('生成成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => this.editData.amount > 0);
    }

    public tapExport() {
        this.downloadService.export('shop/admin/activity/coupon/code_export', {
            coupon: this.queries.coupon
        }, '优惠码记录.xlsx');
    }

    public onUploadFile(event: UploadButtonEvent) {
        const form = new FormData();
        form.append('file', event.files[0]);
        form.append('coupon', this.queries.coupon);
        event.enter();
        this.service.couponCodeImport(form).subscribe({
            next: _ => {
                event.reset();
                this.tapRefresh();
                this.toastrService.success('导入成功');
            },
            error: err => {
                event.reset();
                this.toastrService.error(err);
            }
        });
    }

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
        this.service.couponCodeList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: ICouponLog) {
        this.toastrService.confirm('确定删除“' + item.serial_number + '”优惠码？', () => {
            this.service.couponCodeRemove(item.id).subscribe(res => {
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

}
