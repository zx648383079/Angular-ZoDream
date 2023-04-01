import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../../components/dialog';
import { ButtonEvent } from '../../../../../../components/form';
import { AffiliateService } from '../affiliate.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

    public data = {
        by_user: 0,
        by_user_next: 0,
        by_user_grade: [],
        by_order: 0,
        by_order_scale: 0
    };

    constructor(
        private service: AffiliateService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.service.option().subscribe(res => {
            this.data = res.data;
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        const data: any = Object.assign({}, this.data);
        e?.enter();
        this.service.optionSave(data).subscribe({
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

    public tapAddItem() {
        this.data.by_user_grade.push({
            scale: 0,
        });
    }

    public tapRemoveItem(i: number) {
        this.data.by_user_grade.splice(i, 1);
    }

}
