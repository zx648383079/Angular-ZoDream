import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../../../dialog';
import { IActivityTime } from '../../../../../theme/models/shop';
import { emptyValidate } from '../../../../../theme/validators';
import { ActivityService } from '../../activity.service';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {

    public items: IActivityTime[] = [];
    public activity = 0;
    public editData: IActivityTime = {} as any;

    constructor(
        private service: ActivityService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.activity) {
                this.activity = parseInt(params.activity, 10);
            }
        });
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.timeList().subscribe(res => {
            this.items = res.data;
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
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    open(modal: DialogBoxComponent, item?: IActivityTime) {
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
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        }, () => !emptyValidate(this.editData.title));
    }

}
