import { disabled, form, required } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { IIssue } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { GoodsService } from '../goods.service';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';
import { IItem } from '../../../../../theme/models/seo';
import { mapFormat } from '../../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-goods-issue',
    templateUrl: './goods-issue.component.html',
    styleUrls: ['./goods-issue.component.scss']
})
export class GoodsIssueComponent implements OnInit {
    private readonly service = inject(GoodsService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IIssue[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        goods: 0,
        page: 1,
        per_page: 20,
    }));
    public readonly isMultiple = signal(false);
    public readonly isChecked = signal(false);
    public readonly editForm = form(signal({
        id: 0,
        question: '',
        answer: '',
        status: '0',
        goods_id: 0,
    }), schemaPath => {
        required(schemaPath.question);
        required(schemaPath.answer);
        disabled(schemaPath.question, ({valueOf}) => {
            return valueOf(schemaPath.id) > 0;
        });
    });
    public statusItems: IItem[] = [
        {name: '无', value: 0},
        {name: '置顶', value: 5},
        {name: '软删除', value: 9},
    ];

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IIssue) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.question = item?.question ?? '';
            v.answer = item?.answer ?? '';
            v.status = item?.status as any ?? '0';
            v.goods_id = this.queries.goods().value() as number;
            return {...v};
        });
        modal.open(() => {
            this.service.issueSave({...this.editForm().value()}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public formatStatus(val: number) {
        return mapFormat(val, this.statusItems);
    }

    public readonly checkedItems = computed(() => {
        return this.items().filter(i => i.checked);
    });

    public toggleMultiple() {
        this.isMultiple.update(v => !v);
    }

    public toggleCheck(item?: IIssue) {
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
        this.toastrService.confirm(`确认删除选中的${items.length}条问答？`, () => {
            this.service.issueRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
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
        this.service.issueList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
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

    public tapRemove(item: IIssue) {
        this.toastrService.confirm('确定删除“' + item.question + '”提问？', () => {
            this.service.issueRemove(item.id).subscribe(res => {
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
