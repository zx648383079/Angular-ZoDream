import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IPermission } from '../../../../../theme/models/auth';
import { RoleService } from '../role.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-role-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
    private readonly service = inject(RoleService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        display_name: '',
        description: '',
        permissions: [],
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.display_name);
    });

    public permissionItems: IPermission[] = [];

    ngOnInit() {
        this.service.permissionAll().subscribe(res => {
            this.permissionItems = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.role(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    display_name: res.display_name,
                    description: res.description,
                    permissions: res.permissions.map(i => {
                        return typeof i === 'string' ? parseInt(i, 10) : i;
                    }),
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
        const data: any = this.dataForm().value() as any;
        this.service.roleSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
