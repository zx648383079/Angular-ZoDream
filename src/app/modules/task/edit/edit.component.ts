import { Component, OnInit, inject, signal } from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import {
    IShare,
    ITask
} from '../model';
import { emptyValidate } from '../../../theme/validators';
import {
    TaskService
} from '../task.service';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
    private readonly service = inject(TaskService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        description: '',
        every_time: 25,
        space_time: 5,
        duration: 0,
        start_at: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: ITask;
    public items: ITask[] = [];
    public editData: ITask = {} as any;
    public shareData: IShare = {} as any;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.task(params.id).subscribe(res => {
                this.data = res;
                this.dataModel.set({
                        id: res.id,
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

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
        e?.enter();
        this.service.taskSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
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
                    this.toastrService.success($localize `Save Successfully`);
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
            this.toastrService.success($localize `Delete Successfully`);
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
