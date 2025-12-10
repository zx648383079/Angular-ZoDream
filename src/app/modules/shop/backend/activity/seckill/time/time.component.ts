import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../../components/dialog';
import { IActivityTime } from '../../../../model';
import { emptyValidate } from '../../../../../../theme/validators';
import { ActivityService } from '../../activity.service';

@Component({
    standalone: false,
    selector: 'app-shop-skill-time',
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
    private service = inject(ActivityService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);


    public items: IActivityTime[] = [];
    public isLoading = false;
    public activity = 0;
    public editData: IActivityTime = {} as any;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.activity) {
                this.activity = parseInt(params.activity, 10);
            }
        });
        this.tapRefresh();
    }

    public tapRefresh() {
        this.isLoading = true;
        this.service.timeList().subscribe({
            next: res => {
                this.items = res.data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapRemove(item: any) {
        if (!confirm('确定删除“' + item.title + '”时间段？')) {
            return;
        }
        this.service.timeRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    open(modal: DialogEvent, item?: IActivityTime) {
        this.editData = item ? Object.assign({}, item) : {
            id: undefined,
            title: '',
            start_at: '',
            end_at: ''
        };
        modal.open(() => {
            this.service.timeSave({
                title: this.editData.title,
                start_at: this.editData.start_at,
                end_at: this.editData.end_at,
                id: this.editData?.id
            }).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => !emptyValidate(this.editData.title));
    }

}
