import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../../components/dialog';
import { LegworkService } from '../../legwork.service';
import { IWaiter } from '../../model';

@Component({
    standalone: false,
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
        private toastrService: DialogService,
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
        if (this.data.status === 1 && !confirm($localize `Will continue to save will need to be reviewed again?`)) {
            return;
        }
        const data = Object.assign({}, this.form.value);
        this.service.waiterSave(data).subscribe({
            next: res => {
                this.data = res;
                this.toastrService.success($localize `Submitted successfully, waiting for review!`);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
