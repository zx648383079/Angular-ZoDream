import { form } from '@angular/forms/signals';
import { Component, computed, inject, signal } from '@angular/core';
import { IStorageFile } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { DiskService } from '../../disk.service';
import { DialogService } from '../../../../../components/dialog';
import { IItem } from '../../../../../theme/models/seo';
import { mapFormat, parseNumber } from '../../../../../theme/utils';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-disk-explorer-storage',
    templateUrl: './explorer-storage.component.html',
    styleUrls: ['./explorer-storage.component.scss']
})
export class ExplorerStorageComponent {
    private readonly service = inject(DiskService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<IStorageFile[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public tagItems: IItem[] = [
        {name: '公共', value: 1},
        {name: '内部', value: 2},
    ]
    public readonly queries = form(signal({
        keywords: '',
        tag: '0',
        page: 1,
        per_page: 20,
    }));
    public readonly isMultiple = signal(false);
    public readonly isChecked = signal(false);

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }


    public readonly checkedItems = computed(() => {
        return this.items().filter(i => i.checked);
    });

    public toggleMultiple() {
        this.isMultiple.update(v => !v);
    }

    public toggleCheck(item?: IStorageFile) {
        if (!item) {
            this.isChecked.update(v => !v);
            const isChecked = this.isChecked();
            this.items.update(v => {
                return v.map(i => {
                    i.checked = isChecked;
                    return i;
                });
            });
            return;
        }
        item.checked = !item.checked;
        this.items.update(v => [...v]);
        if (!item.checked) {
            this.isChecked.set(false);
            return;
        }
        if (this.checkedItems().length === this.items().length) {
            this.isChecked.set(true);
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems();
        if (items.length < 1) {
            this.toastrService.warning($localize `No item selected!`);
            return;
        }
        this.toastrService.confirm(`确认删除选中的${items.length}个文件？`, () => {
            this.service.storageRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
        });
    }

    public formatTag(i: number) {
        return mapFormat(i, this.tagItems);
    }


    public tapReload(e?: ButtonEvent) {
        this.toastrService.confirm('确定执行重新索引？此操作将更新文件信息及查漏补缺！', () => {
            e?.enter();
            this.service.storageReload(parseNumber(this.queries.tag().value())).subscribe({
                next: _ => {
                    e?.reset();
                    this.tapRefresh();
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapSync(item: IStorageFile) {
        this.service.storageSync(item.id).subscribe({
            next: _ => {
                this.toastrService.success($localize `Sync finished`);
                this.tapPage();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
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
        this.service.storageSearch(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapRemove(item: IStorageFile) {
        this.toastrService.confirm('确定删除“' + item.name + '”文件？', () => {
            this.service.storageRemove(item.id).subscribe(res => {
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
