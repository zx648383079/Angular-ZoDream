import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../dialog';
import { PanelAnimation } from '../../theme/constants/panel-animation';
import { emptyValidate } from '../../theme/validators';
import { ITask, ITaskDay } from '../model';
import { TaskService } from '../task.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        PanelAnimation
    ],
})
export class HomeComponent {

    public items: ITaskDay[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;
    public panelOpen = false;
    public taskItems: ITask[] = [];
    public keywords = '';
    public taskData: ITask = {} as any;

    constructor(
        private service: TaskService,
        private router: Router,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        this.tapRefresh();
    }

    public tapView(item: ITaskDay) {
        this.router.navigate(['./detail', item.id], {relativeTo: this.route});
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
        this.service.dayList({
            page
        }).subscribe({
            next: res => {
                this.page = page;
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.perPage = res.paging.limit;
            }, error: () => {
                this.isLoading = false;
            }
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

    public searchEnter(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSearch();
    }

    public tapSearch() {
        this.service.taskList({
            page: 1,
            parent_id: 0,
            status: 1,
            keywords: this.keywords,
        }).subscribe(res => {
            this.taskItems = res.data;
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
