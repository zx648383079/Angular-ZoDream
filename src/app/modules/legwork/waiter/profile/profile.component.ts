import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { LegworkService } from '../../legwork.service';
import { IWaiter } from '../../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    private readonly service = inject(LegworkService);
    private readonly toastrService = inject(DialogService);


    public data: IWaiter;
    public readonly dataModel = signal({
        name: '',
        tel: '',
        address: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.tel);
        required(schemaPath.address);
    });

    constructor() {
        this.service.waiterProfile().subscribe(res => {
            this.data = res;
            if (!res.name) {
                return;
            }
            this.dataModel.set({
                name: res.name,
                tel: res.tel,
                address: res.address
            });
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
