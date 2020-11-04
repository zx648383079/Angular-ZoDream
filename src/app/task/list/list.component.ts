import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../../theme/models/seo';
import { ITask } from '../../theme/models/task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

    public items: ITask[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;
    public keywords = '';
    public status = 0;
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

    constructor(
        private service: TaskService,
        private toastrService: ToastrService,
    ) {
        this.tapRefresh();
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.status = form.status || 0;
        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapRemove(item: ITask) {
        if (!confirm('确定要删除《' + item.name + '》?')) {
            return;
        }
        this.service.taskRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }


    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.taskList({
            page,
            status: this.status,
            keywords: this.keywords,
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = res.data;
            this.total = res.paging.total;
            this.perPage = res.paging.limit;
        }, () => {
            this.isLoading = false;
        });
    }

}
