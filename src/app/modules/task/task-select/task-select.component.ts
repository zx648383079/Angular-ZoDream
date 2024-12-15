import { Component } from '@angular/core';
import { PanelAnimation } from '../../../theme/constants';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { ITask } from '../model';
import { TaskService } from '../task.service';

@Component({
    standalone: false,
    selector: 'app-task-select',
    templateUrl: './task-select.component.html',
    styleUrls: ['./task-select.component.scss'],
    animations: [
        PanelAnimation
    ],
})
export class TaskSelectComponent {

    public visible = false;
    public items: ITask[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        parent_id: 0,
        status: 1,
    };

    private confirmFn: (data: ITask) => void;

    constructor(
        private service: TaskService,
        private searchService: SearchService,
    ) { }


    public open(cb: (data: ITask) => void) {
        this.confirmFn = cb;
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }

    public tapItem(item: ITask) {
        if (this.confirmFn) {
            this.confirmFn(item);
        }
    }

    public searchEnter(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSearch();
    }

    public tapSearch(form: any = {keywords: this.keywords}) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.taskList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
