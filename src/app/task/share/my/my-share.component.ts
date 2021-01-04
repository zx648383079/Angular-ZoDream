import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../../../theme/models/seo';
import { IShare } from '../../../theme/models/task';
import { TaskService } from '../../task.service';

@Component({
    selector: 'app-my-share',
    templateUrl: './my-share.component.html',
    styleUrls: ['./my-share.component.scss']
})
export class MyShareComponent {

    public items: IShare[] = [];
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
        private router: Router,
    ) {
        this.tapRefresh();
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.status = form.status || 0;
        this.tapRefresh();
    }

    public tapView(item: IShare) {
        this.router.navigateByUrl('task/share/' + item.id);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapRemove(item: IShare) {
        if (!confirm('确定要删除《' + item.task.name + '》?')) {
            return;
        }
        this.service.shareRemove(item.id).subscribe(res => {
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
        this.service.myShareList({
            page,
            status: this.status,
            keywords: this.keywords,
            parent_id: 0,
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
