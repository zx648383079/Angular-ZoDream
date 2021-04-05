import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CircleProgressComponent } from '../../theme/components';
import { PanelAnimation } from '../../theme/constants/panel-animation';
import {
    ITask,
    ITaskComment,
    ITaskDay
} from '../model';
import { TaskService } from '../task.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    animations: [
        PanelAnimation,
    ]
})
export class DetailComponent implements OnInit {

    @ViewChild(CircleProgressComponent)
    public progressor: CircleProgressComponent;
    public maxProgress = 0;
    public progress = 0;

    public data: ITaskDay;
    public current: ITask;

    public items: ITask[] = [];

    public expanded = false;

    public panelOpen = false;
    public commentItems: ITaskComment[] = [];
    public comment = '';

    constructor(
        private service: TaskService,
        private toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.day(params.id).subscribe(res => {
                this.data = res;
                this.current = res.task;
                if (res.task && res.task.children) {
                    this.items = res.task.children;
                }
                this.refreshComment();
                if (res.log && res.status === 9) {
                    this.maxProgress = res.task.every_time * 60;
                    this.progress = res.log?.time;
                    setTimeout(() => {
                        this.progressor.start(this.progress, this.maxProgress);
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


    public tapPlay(task?: ITask) {
        this.current = task || this.data.task;
        this.service.taskPlay({
            id: this.data.id,
            task_id: this.data.task_id,
            child_id: this.current.id !== this.data.task_id ? this.current.id : 0,
        }).subscribe(res => {
            this.data = res;
            this.maxProgress = res.task.every_time * 60;
            this.progress = res.log?.time;
            this.progressor.start(this.progress, this.maxProgress);
        });
    }

    public tapPause() {
        this.service.taskPause(this.data.id).subscribe(res => {
            this.data = res;
            this.progressor.stop();
        });
    }

    public tapStop() {
        this.service.taskStop(this.data.id).subscribe(res => {
            this.data = res;
            this.progressor.stop();
            if (res.amount < 1) {
                history.back();
            }
        });
    }

    public refreshComment() {
        this.service.commentList({
            task_id: this.data.task_id
        }).subscribe(res => {
            this.commentItems = res.data;
        });
    }

    public commentEnter(event: KeyboardEvent) {
        if (event.code !== 'Enter') {
            return;
        }
        this.tapComment();
    }

    public tapComment() {
        if (!this.comment) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.service.commenSave({
            task_id: this.current.id,
            content: this.comment
        }).subscribe(_ => {
            this.comment = '';
            this.toastrService.success('评论成功');
            this.refreshComment();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        form.append('task_id', this.current.id.toString());
        form.append('file', files[0], files[0].name);
        this.service.commenSave(form).subscribe(_ => {
            this.toastrService.success('评论成功');
            this.refreshComment();
        });
    }
}
