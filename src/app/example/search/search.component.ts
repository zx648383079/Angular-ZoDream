import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DialogEvent } from '../../components/dialog';
import { IPageQueries } from '../../theme/models/page';
import { IFeedback } from '../../theme/models/seo';
import { SearchService } from '../../theme/services';
import { mapFormat } from '../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-example-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class ExampleSearchComponent implements OnInit {

    public items: IFeedback[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
        sort: 'id',
        order: 'desc',
    };
    public editData: IFeedback = {} as any;
    public isMultiple = false;
    public isChecked = false;

    constructor(
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
        
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public toggleCheck(item?: IFeedback) {
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

    public onOpenToggle(item: IFeedback) {

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
        if (this.queries.sort === key) {
            this.queries.order = this.queries.order == 'desc' ? 'asc' : 'desc';
        } else {
            this.queries.sort = key;
            this.queries.order = 'desc';
        }
        this.tapRefresh();
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
        setTimeout(() => {
            this.isLoading = false;
            this.items = [];
            for (let i = 0; i < 20; i++) {
                this.items.push({
                    id: i,
                    name: 'make',
                    phone: '138000000',
                    email: '66@qq.com',
                    content: 'ddddddd',
                    status: 0,
                    created_at: Math.floor(new Date().getTime() / 1000 - i * 100000)
                } as any);
            }
            this.hasMore = page < 10;
            this.total = 190;
            this.isChecked = false;
            this.searchService.applyHistory(this.queries = queries);
        }, 2000);
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapView(modal: DialogEvent, item: IFeedback) {
        this.editData = item;
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
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }


}
