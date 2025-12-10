import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../../components/dialog';
import { LegworkService } from '../../legwork.service';
import { ICategory, IProvider } from '../../model';

@Component({
    standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    private service = inject(LegworkService);
    private fb = inject(FormBuilder);
    private toastrService = inject(DialogService);


    public data: IProvider;
    public form = this.fb.group({
        name: ['', Validators.required],
        logo: ['', Validators.required],
        tel: ['', Validators.required],
        address: ['', Validators.required],
        categories: [],
    });
    public categories: ICategory[] = [];

    ngOnInit() {
        this.service.providerProfile().subscribe(res => {
            this.data = res;
            if (!res.name) {
                return;
            }
            this.form.patchValue({
                name: res.name,
                logo: res.logo,
                tel: res.tel,
                address: res.address,
                categories: res.categories.map(i => i.id),
            });
        });
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
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
        this.service.providerSave(data).subscribe({
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
