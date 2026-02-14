import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../../components/dialog';
import { IActivityTime } from '../../../../model';
import { emptyValidate } from '../../../../../../theme/validators';
import { ActivityService } from '../../activity.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-shop-skill-time',
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.scss']
})
export class TimeComponent {
    private readonly service = inject(ActivityService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);


    public readonly items = signal<IActivityTime[]>([]);
    public readonly isLoading = signal(false);
    public activity = 0;
    public readonly editForm = form(signal({
        id: 0,
        title: '',
        start_at: '',
        end_at: ''
    }), schemaPath => {
        required(schemaPath.title);
    });

    constructor() {
        this.route.params.subscribe(params => {
            if (params.activity) {
                this.activity = parseInt(params.activity, 10);
            }
        });
        this.tapRefresh();
    }

    public tapRefresh() {
        this.isLoading.set(true);
        this.service.timeList().subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.title + '”时间段？', () => {
            this.service.timeRemove(item.id).subscribe(res => {
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

    open(modal: DialogEvent, item?: IActivityTime) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.title = item?.title ?? '';
            v.start_at = item?.start_at as any ?? '';
            v.end_at = item?.end_at as any ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.timeSave({
                title: this.editForm.title,
                start_at: this.editForm.start_at,
                end_at: this.editForm.end_at,
                id: this.editForm?.id
            }).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

}
