import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { SearchService } from '../../../theme/services';
import { formatHour, mapFormat } from '../../../theme/utils';
import { ITask, TaskStatusItems } from '../model';
import { TaskService } from '../task.service';

@Component({
    standalone: false,
    selector: 'app-task-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    private readonly service = inject(TaskService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ITask[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
        status: '0',
        parent_id: 0,
    }));
    public statusItems: IItem[] = [
        {
            name: '进行中',
            value: 1
        },
        {
            name: '已结束',
            value: 2
        },
    ];

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }



    public addToday(item: ITask) {
        this.service.daySave({
            task_id: item.id,
        }).subscribe(_ => {
            this.toastrService.success('已添加今日任务');
        });
    }

    public tapRemove(item: ITask) {
        this.toastrService.confirm('确定要删除《' + item.name + '》?', () => {
            this.service.taskRemove(item.id).subscribe(res => {
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

    public tapSearch(e: Event) {
        e.preventDefault();
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
                this.items.set(res.data.map(this.formatItem));
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    private formatItem(item: ITask): ITask {
        item.formated_time = formatHour(item.time_length, undefined, true);
        item.formated_status = mapFormat(item.status, TaskStatusItems);
        item.tooltip = `已执行时间: ${item.formated_time}\n状态: ${item.formated_status}`;
        return item;
    }

}
