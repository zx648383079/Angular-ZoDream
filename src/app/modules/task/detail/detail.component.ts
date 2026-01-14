import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ThemeService } from '../../../theme/services';
import { CircleProgressComponent } from '../circle-progress/circle-progress.component';
import {
    ITask,
    ITaskDay
} from '../model';
import { TaskService } from '../task.service';
import { NavigationDisplayMode } from '../../../theme/models/event';

@Component({
    standalone: false,
    selector: 'app-task-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(TaskService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly themeService = inject(ThemeService);


    public readonly progressor = viewChild(CircleProgressComponent);
    public maxProgress = 0;
    public progress = 0;

    public readonly data = signal<ITaskDay>(null);
    public readonly current = signal<ITask>(null);
    public readonly items = signal<ITask[]>([]);
    public readonly expanded = signal(false);

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.day(params.id).subscribe(res => {
                this.data.set(res);
                this.current.set(res.task);
                if (res.task && res.task.children) {
                    this.items.set(res.task.children);
                }
                if (res.log && res.status === 9) {
                    this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Collapse);
                    this.maxProgress = res.task.every_time * 60;
                    this.progress = res.log?.time;
                    setTimeout(() => {
                        this.progressor().start(this.progress, this.maxProgress);
                    }, 100);
                }
            });
        });
    }

    // ngAfterViewInit() {
    //     this.childrenComponent.changes.subscribe((items: QueryList<CircleProgressComponent>) => {
    //         this.progressor = items.first;
    //         if (this.data && this.data.log && this.data.status === 9) {
    //             this.maxProgress = this.data.task.every_time * 60;
    //             this.progress = this.data.log?.time;
    //             this.progressor.start(this.progress, this.maxProgress);
    //         }
    //     });
    // }


    public toggleExpand() {
        this.expanded.update(v => !v);
    }


    public tapPlay(task?: ITask) {
        this.current.set(task || this.data().task);
        this.service.taskPlay({
            id: this.data().id,
            task_id: this.data().task_id,
            child_id: this.current().id !== this.data().task_id ? this.current().id : 0,
        }).subscribe({
            next: res => {
                this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Collapse);
                this.data.set(res);
                this.maxProgress = res.task.every_time * 60;
                this.progress = res.log?.time;
                this.progressor().start(this.progress, this.maxProgress);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapPause() {
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Inline);
        this.service.taskPause(this.data().id).subscribe({
            next: res => {
                this.data.set(res);
                this.progressor().stop();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapStop() {
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Inline);
        this.service.taskStop(this.data().id).subscribe({
            next: res => {
                this.data.set(res);
                this.progressor().stop();
                if (res.amount < 1) {
                    history.back();
                }
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapCheck() {
        this.service.taskCheck(this.data().id).subscribe({
            next: res => {
                if (!res.data) {
                    return;
                }
                this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Inline);
                this.data.set(res.data);
                this.toastrService.success(res.message);
                this.toastrService.notify({
                    title: '提示',
                    content: res.message
                });
                this.progressor().stop();
                if (this.data().amount < 1) {
                    history.back();
                }
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }
}
