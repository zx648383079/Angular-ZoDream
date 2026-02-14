import { Component, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import {
    ActivatedRoute
} from '@angular/router';
import {
    IShare,
    ITask
} from '../model';
import {
    TaskService
} from '../task.service';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-task-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent {
    private readonly service = inject(TaskService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);


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
    public readonly items = signal<ITask[]>([]);
    public readonly editForm = form(signal<ITask>({
        id: 0,
        name: '',
        description: '',
        every_time: 0,
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly shareForm = form(signal({
        id: 0,
        task_id: 0,
        task: null,
        share_type: '0',
        share_rule: ''
    }));

    constructor() {
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
                    this.items.set(res.children);
                }
            });
        });
    }

    public readonly shareUrl = computed(() =>  {
        return 'http://' + location.host + '/task/share/' + this.shareForm.id().value();
    });

    public tapBack() {
        this.location.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
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

    openDialog(modal: DialogEvent, item ?: ITask) {
        if (!this.data || this.data.id < 1) {
            this.toastrService.warning('请先保存主任务');
            return;
        }
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.description = item?.description ?? '';
            v.every_time = item?.every_time ?? 0;
            return {...v};
        });
        modal.open(() => {
            this.service.taskSave({
                name: this.editForm.name,
                parent_id: this.data?.id,
                id: this.editForm?.id,
                description: this.editForm.description,
                every_time: this.data?.every_time,
            }).subscribe({
                next: res => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.items.update(v => {
                        v.push(res);
                        return [...v];
                    });
                },
                error: err => {
                    this.toastrService.warning(err.message);
                }
            });
        }, () => this.editForm().valid());
    }

    public tapRemove(item: ITask) {
        this.toastrService.confirm('确定要删除《' + item.name + '》?', () => {
            this.service.taskRemove(item.id).subscribe(res => {
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

    public tapShare(modal: DialogEvent) {
        if (!this.data || this.data.id < 1) {
            return;
        }
        if (this.shareForm.task_id().value() !== this.data.id) {
            this.shareForm().value.set({id: 0, task: this.data, task_id: this.data.id, share_type: '0', share_rule: ''});
        }
        modal.open(() => {
            const data = this.shareForm().value();
            this.service.shareCreate({
                task_id: data.task_id,
                share_type: data.share_type,
                share_rule: data.share_rule,
            }).subscribe(res => {
                this.shareForm().value.set(res as any);
                this.tapShare(modal);
            });
        }, () => !this.shareForm.id().value());
    }
}
