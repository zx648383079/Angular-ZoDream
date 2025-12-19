import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../../../components/dialog';
import { ButtonEvent } from '../../../../../../components/form';
import { AffiliateService } from '../affiliate.service';
import { form } from '@angular/forms/signals';

interface IUserGrade {
    scale: number;
}

@Component({
    standalone: false,
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
    private readonly service = inject(AffiliateService);
    private readonly toastrService = inject(DialogService);


    public readonly dataForm = form(signal({
        by_user: 0,
        by_user_next: 0,
        by_user_grade: <IUserGrade[]>[],
        by_order: 0,
        by_order_scale: 0
    }));

    ngOnInit() {
        this.service.option().subscribe(res => {
            this.dataForm().value.set(res.data);
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        const data = this.dataForm().value();
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
        this.dataForm.by_user_grade().value.update(v => {
            v.push({
                scale: 0
            })
            return v;
        });
    }

    public tapRemoveItem(i: number) {
        this.dataForm.by_user_grade().value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

}
