import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../../../../components/dialog';
import { ButtonEvent } from '../../../../../../components/form';
import { TbkService } from '../tbk.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

    public form = this.fb.group({
        app_key: ['', Validators.required],
        secret: ['', Validators.required],
    });

    constructor(
        private service: TbkService,
        private fb: FormBuilder,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.service.option().subscribe(res => {
            this.form.patchValue({
                app_key: res.data.app_key,
                secret: res.data.secret
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
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

}
