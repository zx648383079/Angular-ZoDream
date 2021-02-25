import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LegworkService } from '../../legwork.service';
import { IWaiter } from '../../model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public data: IWaiter;
    public form = this.fb.group({
        name: ['', Validators.required],
        tel: ['', Validators.required],
        address: ['', Validators.required],
    });

    constructor(
        private service: LegworkService,
        private fb: FormBuilder,
        private toastrService: ToastrService,
    ) { }

    ngOnInit() {
        this.service.waiterProfile().subscribe(res => {
            this.data = res;
            if (!res.name) {
                return;
            }
            this.form.patchValue({
                name: res.name,
                tel: res.tel,
                address: res.address
            });
        });
    }

    public tapSubmit() {
        if (!this.form.valid) {
            return;
        }
        if (this.data.status === 1 && !confirm('继续保存将需要重新审核？')) {
            return;
        }
        const data = Object.assign({}, this.form.value);
        this.service.waiterSave(data).subscribe(res => {
            this.data = res;
            this.toastrService.success('提交成功，等待审核!');
        });
    }

}
