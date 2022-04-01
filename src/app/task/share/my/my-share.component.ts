import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { applyHistory, getQueries } from '../../../theme/query';
import { IShare } from '../../model';
import { TaskService } from '../../task.service';

@Component({
    selector: 'app-my-share',
    templateUrl: './my-share.component.html',
    styleUrls: ['./my-share.component.scss']
})
export class MyShareComponent implements OnInit {

    public items: IShare[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        status: 0,
        page: 1,
        per_page: 20,
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

    constructor(
        private service: TaskService,
        private toastrService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapView(item: IShare) {
        this.router.navigate(['../', item.id], {relativeTo: this.route});
    }

    public tapPage() {
        this.goPage(this.queries.page);
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
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.myShareList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isLoading = false;
                applyHistory(this.queries = queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}
