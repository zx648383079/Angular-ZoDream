import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../dialog';
import { IPageQueries } from '../../theme/models/page';
import { IItem } from '../../theme/models/seo';
import { applyHistory, getQueries } from '../../theme/query';
import { twoPad } from '../../theme/utils';
import { ITaskPlan } from '../model';
import { TaskSelectComponent } from '../task-select/task-select.component';
import { TaskService } from '../task.service';

@Component({
    selector: 'app-plan',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnInit {

    @ViewChild(TaskSelectComponent)
    private taskModal: TaskSelectComponent;
    @ViewChild('addModal')
    private addModal: DialogEvent; 
    
    public items: ITaskPlan[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        type: 0,
    };
    public typeItems = ['一天', '每周', '每月'];
    public weekNameItems: IItem[] = [];
    public monthNameItems: IItem[] = [];
    public editData: ITaskPlan = {} as any;

    constructor(
        private service: TaskService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {
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
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    get weekItems() {
        const items = this.weekNameItems.map(i => {
            return {
                label: i.name,
                value: i.value,
                items: []
            }
        });
        for (const item of this.items) {
            const w = item.plan_time as number - 1;
            items[w].items.push(Object.assign({
                style: {
                    left: w * 200 + 'px',
                    top: items[w].items.length * 40 + 'px',
                }
            }, item));
        }
        return items;
    }

    get monthItems() {
        const items = this.monthNameItems.map(i => {
            return {
                label: i.name,
                value: i.value,
                items: []
            }
        })
        for (const item of this.items) {
            const i = item.plan_time as number - 1;
            items[i].items.push(Object.assign({}, item));
        }
        return items;
    }

    public tapAdd() {
        this.taskModal.open(item => {
            this.editData = {task: item, task_id: item.id, amount: 1, priority: 8, plan_type: this.queries.type, plan_time: ''};
            this.addModal.open(() => {
                this.service.planSave({...this.editData, task: undefined}).subscribe({
                    next: res => {
                        this.pushPlan(res);
                        this.toastrService.success('添加成功');
                    },
                    error: err => {
                        this.toastrService.error(err);
                    }
                });
            }, () => !!this.editData.plan_time);
        });
    }

    private pushPlan(item: ITaskPlan) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id == item.id) {
                this.items[i] = item;
                return;
            }
        }
        this.items.push(item);
    }

    public tapType(i: number) {
        this.queries.type = i;
        this.tapRefresh();
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

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.planList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapRemove(item: ITaskPlan) {
        if (!confirm('确定要删除当前计划?')) {
            return;
        }
        this.service.planRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
