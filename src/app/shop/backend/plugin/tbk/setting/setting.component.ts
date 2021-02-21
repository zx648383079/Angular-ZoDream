import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TbkService } from '../../tbk.service';

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
        private toastrService: ToastrService,
    ) {
    }

    ngOnInit() {
        this.service.option().subscribe(res => {
            this.form.setValue({
                app_key: res.app_key,
                secret: res.secret
            });
        });
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
        this.service.optionSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
