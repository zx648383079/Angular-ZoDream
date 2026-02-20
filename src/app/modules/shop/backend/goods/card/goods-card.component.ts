import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent, UploadButtonEvent } from '../../../../../components/form';
import { IPageQueries } from '../../../../../theme/models/page';
import { IGoodsCard } from '../../../model';
import { FileUploadService, SearchService } from '../../../../../theme/services';
import { GoodsService } from '../goods.service';

@Component({
    standalone: false,
    selector: 'app-goods-card',
    templateUrl: './goods-card.component.html',
    styleUrls: ['./goods-card.component.scss']
})
export class GoodsCardComponent {
    private readonly service = inject(GoodsService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly uploadService = inject(FileUploadService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IGoodsCard[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        goods: 0,
        page: 1,
        per_page: 20,
    }));
    public readonly editForm = form(signal({
        amount: 1,
    }), schemaPath => {
        required(schemaPath.amount);
    });

    constructor() {
        this.route.params.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapGenerate(modal: DialogEvent) {
        modal.open(() => {
            this.service.cardGenerate({
                amount: this.editForm.amount,
                goods: this.queries.goods
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
        this.uploadService.export('shop/admin/goods/card_export', {
            goods: this.queries.goods
        }, '卡密记录.xlsx').subscribe({
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
        form.append('goods', this.queries.goods().value() as any);
        event.enter();
        this.service.cardImport(form).subscribe({
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
        this.service.cardList(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['goods']);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IGoodsCard) {
        this.toastrService.confirm('确定删除“' + item.card_no + '”卡密？', () => {
            this.service.cardRemove(item.id).subscribe(res => {
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
