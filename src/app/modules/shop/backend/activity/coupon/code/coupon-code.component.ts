import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../../components/dialog';
import { ButtonEvent, UploadButtonEvent } from '../../../../../../components/form';
import { IPageQueries } from '../../../../../../theme/models/page';
import { ICouponLog } from '../../../../model';
import { SearchService } from '../../../../../../theme/services';
import { DownloadService } from '../../../../../../theme/services';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
    selector: 'app-shop-coupon-code',
    templateUrl: './coupon-code.component.html',
    styleUrls: ['./coupon-code.component.scss']
})
export class CouponCodeComponent implements OnInit {
    private readonly service = inject(ActivityService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly downloadService = inject(DownloadService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ICouponLog[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        coupon: 0,
        page: 1,
        per_page: 20,
    }));
    public readonly editForm = form(signal({
        amount: 1,
    }), schemaPath => {
        required(schemaPath.amount);
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.coupon) {
                this.queries.coupon().value.set(parseInt(params.coupon, 10));
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapGenerate(modal: DialogEvent) {
        modal.open(() => {
            this.service.couponCodeGenerate({
                amount: this.editForm.amount,
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
        }, () => this.editForm().valid());
    }

    public tapExport(event?: ButtonEvent) {
        event?.enter();
        this.downloadService.export('shop/admin/activity/coupon/code_export', {
            coupon: this.queries.coupon
        }, '优惠码记录.xlsx').subscribe({
            next: _ => {
                event?.reset();
            },
            error: err => {
                event?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public onUploadFile(event: UploadButtonEvent) {
        const form = new FormData();
        form.append('file', event.files[0]);
        form.append('coupon', this.queries.coupon().value() as any);
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
        this.service.couponCodeList(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: ICouponLog) {
        this.toastrService.confirm('确定删除“' + item.serial_number + '”优惠码？', () => {
            this.service.couponCodeRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
