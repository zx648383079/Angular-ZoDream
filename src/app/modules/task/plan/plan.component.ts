import { form, max, min } from '@angular/forms/signals';
import { Component, inject, viewChild, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IItem } from '../../../theme/models/seo';
import { SearchService } from '../../../theme/services';
import { twoPad } from '../../../theme/utils';
import { ITask, ITaskPlan } from '../model';
import { TaskSelectComponent } from '../task-select/task-select.component';
import { TaskService } from '../task.service';

@Component({
    standalone: false,
    selector: 'app-task-plan',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.scss'],
})
export class PlanComponent {
    private readonly service = inject(TaskService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    private readonly taskModal = viewChild(TaskSelectComponent);
    private readonly addModal = viewChild<DialogEvent>('addModal');

    public readonly items = signal<ITaskPlan[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
        type: 0,
    }));
    public typeItems = ['一天', '每周', '每月'];
    public weekNameItems: IItem[] = [];
    public monthNameItems: IItem[] = [];
    public readonly editForm = form(signal({
        task: <ITask>null,
        task_id: 0,
        amount: 0,
        plan_type: 0,
        plan_time: '0',
        priority: 0,
    }), schemaPath => {
        min(schemaPath.amount, 1);
        max(schemaPath.amount, 20);
        min(schemaPath.priority, 1);
        max(schemaPath.priority, 99);
    });

    constructor() {
        ['一', '二', '三', '四', '五', '六', '日'].forEach((i, j) => {
            this.weekNameItems.push({
                name: '周' + i,
                value: j + 1
            });
        });
        for (let index = 1; index <= 31; index++) {
            this.monthNameItems.push({
                name: twoPad(index),
                value: index
            });
        }
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public readonly weekItems = computed(() => {
        const items = this.weekNameItems.map(i => {
            return {
                label: i.name,
                value: i.value,
                items: []
            }
        });
        for (const item of this.items()) {
            const w = item.plan_time as number - 1;
            items[w].items.push(Object.assign({
                style: {
                    left: w * 200 + 'px',
                    top: items[w].items.length * 40 + 'px',
                }
            }, item));
        }
        return items;
    });

    public readonly monthItems = computed(() => {
        const items = this.monthNameItems.map(i => {
            return {
                label: i.name,
                value: i.value,
                items: []
            }
        })
        for (const item of this.items()) {
            const i = item.plan_time as number - 1;
            items[i].items.push(Object.assign({}, item));
        }
        return items;
    });

    public tapAdd() {
        this.taskModal().open(item => {
            this.editForm().value.set({
                task: item, 
                task_id: item.id, 
                amount: 1, 
                priority: 8, 
                plan_type: this.queries.type().value() as any, 
                plan_time: ''});
            this.addModal().open(() => {
                this.service.planSave({...this.editForm().value(), task: undefined}).subscribe({
                    next: res => {
                        this.pushPlan(res);
                        this.toastrService.success('添加成功');
                    },
                    error: err => {
                        this.toastrService.error(err);
                    }
                });
            }, () => !!this.editForm.plan_time);
        });
    }

    private pushPlan(item: ITaskPlan) {
        for (let i = 0; i < this.items().length; i++) {
            if (this.items[i].id == item.id) {
                this.items[i] = item;
                return;
            }
        }
        this.items.update(v => {
            v.push(item);
            return [...v];
        });
    }

    public tapType(i: number) {
        this.queries.type().value.set(i);
        this.tapRefresh();
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

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.planList(queries).subscribe({
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

    public tapRemove(item: ITaskPlan) {
        this.toastrService.confirm('确定要删除当前计划?', () => {
            this.service.planRemove(item.id).subscribe(res => {
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

}
