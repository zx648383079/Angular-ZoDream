import { Component, OnInit, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { ITask, ITaskDay } from '../model';
import { TaskSelectComponent } from '../task-select/task-select.component';
import { TaskService } from '../task.service';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    private service = inject(TaskService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);
    private searchService = inject(SearchService);


    private readonly taskModal = viewChild(TaskSelectComponent);

    public items: ITaskDay[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
    };
    public taskData: ITask = {} as any;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapView(item: ITaskDay) {
        this.router.navigate(['./detail', item.id], {relativeTo: this.route});
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
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
        this.service.dayList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapAdd() {
        this.taskModal().open(item => {
            this.tapAddTo(item);
        });
    }

    public tapAddTo(item: ITask) {
        this.service.daySave({
            task_id: item.id,
        }).subscribe(res => {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id === res.id) {
                    this.items[i] = res;
                    return;
                }
            }
            this.items.push(res);
        });
    }

    public tapFastNew(modal: DialogBoxComponent) {
        modal.open(() => {
            this.service.taskFastCreate(this.taskData).subscribe({
                next: res => {
                    this.items.push(res);
                    this.toastrService.success('添加成功');
                    this.taskData = {} as any;
                }, error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => !emptyValidate(this.taskData.name));
    }
}
