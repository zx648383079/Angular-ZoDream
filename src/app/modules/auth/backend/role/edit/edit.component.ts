import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IPermission, IRole } from '../../../../../theme/models/auth';
import { RoleService } from '../role.service';

@Component({
    standalone: false,
    selector: 'app-role-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        display_name: ['', Validators.required],
        description: [''],
        permissions: [[] as number[]],
    });

    public data: IRole;

    public permissionItems: IPermission[] = [];

    constructor(
        private fb: FormBuilder,
        private service: RoleService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.service.permissionAll().subscribe(res => {
            this.permissionItems = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.role(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
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

    get name() {
        return this.form.get('name');
    }

    get displayName() {
        return this.form.get('display_name');
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.roleSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
