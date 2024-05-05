import { Component, OnInit } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { SearchService } from '../../../../theme/services';
import { TrackerBackendService } from '../tracker.service';
import { ITradeLog } from '../../model';
import { emptyValidate } from '../../../../theme/validators';

@Component({
    selector: 'app-tracker-backend-log',
    templateUrl: './log.component.html',
    styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

    public items: ITradeLog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        product: 0,
        channel: 0,
        keywords: '',
        per_page: 20,
    };
    public isMultiple = false;
    public isChecked = false;
    public editData = {} as any;

    constructor(
        private service: TrackerBackendService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        })
    }


    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public open(modal: DialogEvent) {
        modal.open(() => {
            this.service.logAdd(this.editData).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editData.product) && !emptyValidate(this.editData.channel) && !emptyValidate(this.editData.price);
        });
    }

    public toggleCheck(item?: any) {
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
        this.toastrService.confirm(`确认删除选中的${items.length}条记录？`, () => {
            this.service.logRemove(items.map(i => i.id)).subscribe(res => {
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
        this.service.logList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: ITradeLog) {
        this.toastrService.confirm('确认删除此条记录？', () => {
            this.service.logRemove(item.id).subscribe(res => {
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
