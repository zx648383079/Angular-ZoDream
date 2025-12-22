import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, viewChild, signal } from '@angular/core';
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
    private readonly service = inject(TaskService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    private readonly taskModal = viewChild(TaskSelectComponent);

    public readonly items = signal<ITaskDay[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
    }));
    public readonly taskForm = form(signal({
        name: '',
        description: ''
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        this.goPage(this.queries.page().value());
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
        this.service.dayList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
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
            this.items.update(v => {
                for (let i = 0; i < this.items.length; i++) {
                    if (v[i].id === res.id) {
                        v[i] = res;
                        return v;
                    }
                }
                v.push(res);
                return v;
            });
        });
    }

    public tapFastNew(modal: DialogBoxComponent) {
        modal.open(() => {
            this.service.taskFastCreate(this.taskForm().value()).subscribe({
                next: res => {
                    this.items.update(v => {
                        v.push(res);
                        return v;
                    });
                    this.toastrService.success('添加成功');
                    this.taskForm().value.set({
                        name: '',
                        description: ''
                    });
                }, error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => this.taskForm().valid());
    }
}
