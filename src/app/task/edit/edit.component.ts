import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    ActivatedRoute
} from '@angular/router';
import {
    IShare,
    ITask
} from '../model';
import { emptyValidate } from '../../theme/validators';
import {
    TaskService
} from '../task.service';
import { DialogBoxComponent, DialogService } from '../../dialog';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        every_time: [25],
        space_time: [5],
        duration: [0],
        start_at: [''],
    });

    public data: ITask;

    public items: ITask[] = [];

    public editData: ITask = {} as any;

    public shareData: IShare = {} as any;

    constructor(
        private fb: FormBuilder,
        private service: TaskService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.task(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    description: res.description,
                    every_time: res.every_time,
                    space_time: res.space_time,
                    duration: res.duration,
                    start_at: res.start_at,
                });
                if (res.children) {
                    this.items = res.children;
                }
            });
        });
    }

    get shareUrl() {
        return 'http://' + location.host + '/task/share/' + this.shareData.id;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.taskSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

    openDialog(modal: DialogBoxComponent, item ?: ITask) {
        if (!this.data || this.data.id < 1) {
            this.toastrService.warning('请先保存主任务');
            return;
        }
        this.editData = item ? {...item} : {
            id: undefined,
            name: '',
            description: '',
            every_time: 0,
        };
        modal.open(() => {
            this.service.taskSave({
                name: this.editData.name,
                parent_id: this.data?.id,
                id: this.editData?.id,
                description: this.editData.description,
                every_time: this.data?.every_time,
            }).subscribe({
                    next: res => {
                    this.toastrService.success('保存成功');
                    this.items.push(res);
                }, error: err => {
                    this.toastrService.warning(err.message);
                }
            });
        }, () => !emptyValidate(this.editData.name));
    }

    public tapRemove(item: ITask) {
        if (!confirm('确定要删除《' + item.name + '》?')) {
            return;
        }
        this.service.taskRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapShare(modal: DialogBoxComponent) {
        if (!this.data || this.data.id < 1) {
            return;
        }
        if (this.shareData.task_id !== this.data.id) {
            this.shareData = {id: 0, task: this.data, task_id: this.data.id, share_type: 0, share_rule: ''};
        }
        modal.open(() => {
            this.service.shareCreate({
                task_id: this.shareData.task_id,
                share_type: this.shareData.share_type,
                share_rule: this.shareData.share_rule,
            }).subscribe(res => {
                this.shareData = res;
                this.tapShare(modal);
            });
        }, () => !this.shareData.id);
    }
}
