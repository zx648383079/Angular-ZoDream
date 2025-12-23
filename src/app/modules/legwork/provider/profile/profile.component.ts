import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { LegworkService } from '../../legwork.service';
import { ICategory, IProvider } from '../../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    private readonly service = inject(LegworkService);
    private readonly toastrService = inject(DialogService);


    public data: IProvider;
    public readonly dataModel = signal({
        name: '',
        logo: '',
        tel: '',
        address: '',
        categories: [],
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.logo);
        required(schemaPath.tel);
        required(schemaPath.address);
    });
    public categories: ICategory[] = [];

    ngOnInit() {
        this.service.providerProfile().subscribe(res => {
            this.data = res;
            if (!res.name) {
                return;
            }
            this.dataModel.set({
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

    public tapSubmit(e: Event) {
        e.preventDefault();
        if (this.dataForm().invalid()) {
            return;
        }
        if (this.data.status === 1 && !confirm($localize `Will continue to save will need to be reviewed again?`)) {
            return;
        }
        const data = this.dataForm().value();
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
