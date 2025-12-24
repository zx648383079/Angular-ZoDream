import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { ITask } from '../model';
import { TaskService } from '../task.service';

@Component({
    standalone: false,
    selector: 'app-task-select',
    templateUrl: './task-select.component.html',
    styleUrls: ['./task-select.component.scss'],
})
export class TaskSelectComponent {
    private readonly service = inject(TaskService);
    private readonly searchService = inject(SearchService);


    public readonly visible = signal(false);
    public readonly items = signal<ITask[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
        parent_id: 0,
        status: 1,
    }));

    private confirmFn: (data: ITask) => void;


    public open(cb: (data: ITask) => void) {
        this.confirmFn = cb;
        this.visible.set(true);
    }

    public close() {
        this.visible.set(false);
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

    public tapSearch() {
        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.taskList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
