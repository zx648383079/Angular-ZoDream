import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { SearchService } from '../../../theme/services';
import { IShare } from '../model';
import { TaskService } from '../task.service';

@Component({
    standalone: false,
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
    private readonly service = inject(TaskService);
    private readonly toastrService = inject(DialogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IShare[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        status: 0,
        page: 1,
        per_page: 20,
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

    public tapView(item: IShare) {
        this.router.navigateByUrl('task/share/' + item.id);
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapRemove(item: IShare) {
        if (!confirm('确定要删除《' + item.task.name + '》?')) {
            return;
        }
        this.service.shareRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
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
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.shareList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.isLoading = false;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
