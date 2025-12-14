import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IPermission } from '../../../../../theme/models/auth';
import { RoleService } from '../role.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-role-edit-permission',
    templateUrl: './edit-permission.component.html',
    styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent implements OnInit {
    private readonly service = inject(RoleService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        display_name: '',
        description: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.display_name);
    });

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.permission(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    display_name: res.display_name,
                    description: res.description
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IPermission = this.dataForm().value() as any;
        this.service.permissionSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
