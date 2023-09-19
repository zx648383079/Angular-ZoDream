import { Component, OnInit } from '@angular/core';
import { IPageEditItem, IPageQueries } from '../../../theme/models/page';

@Component({
    selector: 'app-system-plugin',
    templateUrl: './plugin.component.html',
    styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit {

    public isChecked = false;
    public items: IPageEditItem[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 120;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
    };

    constructor() { }

    ngOnInit() {
        for (let i = 0; i < 20; i++) {
            this.items.push({});    
        }
    }

    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public toggleCheck(item?: IPageEditItem) {
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
        // this.service.feedbackList(queries).subscribe({
        //     next: res => {
        //         this.isLoading = false;
        //         this.items = res.data;
        //         this.hasMore = res.paging.more;
        //         this.total = res.paging.total;
        //         this.isChecked = false;
        //         this.searchService.applyHistory(this.queries = queries);
        //     },
        //     error: _ => {
        //         this.isLoading = false;
        //     }
        // });
    }
}
