import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DialogEvent } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IFeedback } from '../../../theme/models/seo';
import { SearchService } from '../../../theme/services';
import { mapFormat } from '../../../theme/utils';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-example-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class ExampleSearchComponent {
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IFeedback[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        keywords: '',
        per_page: 20,
        sort: 'id',
        order: 'desc',
    }));
    public readonly editModel = signal<IFeedback>({} as any);
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

    public toggleCheck(item?: IFeedback) {
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

    public onOpenToggle(item: IFeedback) {
        console.log(item);
        
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems;
        if (items.length < 1) {
            this.toastrService.warning($localize `No item selected!`);
            return;
        }
        this.toastrService.confirm(`确认删除选中的${items.length}条反馈？`, () => {

        });
    }

    public formatStatus(val: number) {
        return mapFormat(val, ['未读', '已读']);
    }

    public tapSort(key: string) {
        this.queries().value.update(v => {
            if (v.sort === key) {
                v.order = v.order == 'desc' ? 'asc' : 'desc';
            } else {
                v.sort = key;
                v.order = 'desc';
            }
            return {...v};
        });
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        setTimeout(() => {
            this.isLoading.set(false);
            const items = [];
            for (let i = 0; i < 20; i++) {
                items.push({
                    id: i,
                    name: 'make',
                    phone: '138000000',
                    email: '66@qq.com',
                    content: 'ddddddd',
                    status: 0,
                    open_status: i % 2,
                    created_at: Math.floor(Date.now() / 1000 - i * 100000)
                } as any);
            }
            this.items.set(items);
            this.hasMore = page < 10;
            this.total.set(190);
            this.isChecked.set(false);
            this.searchService.applyHistory(queries);
            this.queries().value.set(queries);
        }, 2000);
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapView(modal: DialogEvent, item: IFeedback) {
        this.editModel.set(item);
        modal.openCustom(value => {
            if (typeof value !== 'number') {
                return;
            }
            this.toastrService.success($localize `Save Successfully`);
        });
    }

    public tapRemove(item: IFeedback) {
        this.toastrService.confirm('确认删除此反馈？', () => {
            this.toastrService.success($localize `Delete Successfully`);
            this.items.update(v => {
                return v.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }


}
