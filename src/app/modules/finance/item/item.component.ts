import { Component, inject, signal } from '@angular/core';
import { FinanceService } from '../finance.service';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../theme/services';
import { form, required } from '@angular/forms/signals';
import { Location } from '@angular/common';
import { IItem, ItemTypeItems } from '../model';
import { ArraySource } from '../../../components/form';
import { formatTime } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-finance-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent {

    private readonly service = inject(FinanceService);
    private readonly toastrService = inject(DialogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly location = inject(Location);

    public readonly items = signal<IItem[]>([]);
    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);
    public readonly total = signal(0);

    public readonly subtotal = signal({
        avg: 0,
        total: 0
    });
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
    }));

    public readonly typeItems = [...ItemTypeItems];
    public readonly statusItems = ArraySource.fromOrder('报废', '正常');
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        type: '',
        remark: '',
        status: 1,
        deleted_at: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapBack() {
        this.location.back();
    }

    public tapItem(item: IItem) {
        this.router.navigate([item.id], {relativeTo: this.route});
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

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.itemList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore.set(res.paging.more);
                this.total.set(res.paging.total);
                if ((res as any).subtotal) {
                    this.subtotal.set((res as any).subtotal);
                }
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IItem) {
        this.toastrService.confirm('确定删除“' + item.name + '”物品？', () => {
            this.service.itemRemove(item.id).subscribe(res => {
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

    public open(modal: DialogEvent, item?: IItem, scrap = false) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.remark = item?.remark ?? '';
            v.status = item?.status ?? 1;
            v.deleted_at = item?.deleted_at ?? '';
            if (scrap && item) {
                v.status = 0;
                v.deleted_at = formatTime(new Date());
            }
            return {...v};
        });
        modal.open(() => {
            const data = {...this.editForm().value()};
            if (data.status == 1) {
                data.deleted_at = '';
            }
            this.service.itemSave(data).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => this.editForm().valid());
    }

}
