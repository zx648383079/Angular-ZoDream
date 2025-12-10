import { Component, OnInit, inject } from '@angular/core';
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
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    private service = inject(TaskService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: ITask[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        status: 0,
        parent_id: 0,
    };
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
            this.queries = this.searchService.getQueries(params, this.queries);
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
        if (!confirm('确定要删除《' + item.name + '》?')) {
            return;
        }
        this.service.taskRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapSearch(form: any) {
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
                this.items = res.data.map(this.formatItem);
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            }, 
            error: () => {
                this.isLoading = false;
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
