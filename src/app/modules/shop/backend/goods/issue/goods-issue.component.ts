import { Component, OnInit, inject } from '@angular/core';
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
    private service = inject(GoodsService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IIssue[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        goods: 0,
        page: 1,
        per_page: 20,
    };
    public isMultiple = false;
    public isChecked = false;
    public editData: IIssue = {} as any;
    public statusItems: IItem[] = [
        {name: '无', value: 0},
        {name: '置顶', value: 5},
        {name: '软删除', value: 9},
    ];

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IIssue) {
        this.editData = item ? {...item} : {
            goods_id: this.queries.goods
        } as any;
        modal.open(() => {
            this.service.issueSave({...this.editData}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public formatStatus(val: number) {
        return mapFormat(val, this.statusItems);
    }

    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public toggleCheck(item?: IIssue) {
        if (!item) {
            this.isChecked = !this.isChecked;
            this.items.forEach(i => {
                i.checked = this.isChecked;
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked = false;
            return;
        }
        if (this.checkedItems.length === this.items.length) {
            this.isChecked = true;
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems;
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
        this.service.issueList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IIssue) {
        this.toastrService.confirm('确定删除“' + item.question + '”提问？', () => {
            this.service.issueRemove(item.id).subscribe(res => {
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
