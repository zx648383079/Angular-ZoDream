import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IRole } from '../../../../theme/models/auth';
import { IUser, SexItems } from '../../../../theme/models/user';
import { FileUploadService } from '../../../../theme/services/file-upload.service';
import { confirmValidator } from '../../../../theme/validators';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditUserComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        sex: [0],
        birthday: [''],
        roles: [[] as number[]],
        password: [''],
        confirm_password: [''],
    }, {
        validators: confirmValidator()
    });

    public data: IUser;
    public roleItems: IRole[] = [];
    public sexItems = SexItems;

    constructor(
        private fb: FormBuilder,
        private service: AuthService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) {}

    ngOnInit() {
        this.service.roleAll().subscribe(res => {
            this.roleItems = res.data;
        });
        this.route.params.subscribe(params => {
        if (!params.id) {
            return;
        }
        this.service.userDetail(params.id).subscribe(res => {
            this.data = res;
            this.form.patchValue({
                name: res.name,
                sex: res.sex,
                email: res.email,
                birthday: res.birthday,
                roles: res.roles.map(i => {
                        return typeof i === 'string' ? parseInt(i, 10) : i;
                    }),
                password: '',
                confirm_password: '',
            });
        });
        });
    }

    get name() {
        return this.form.get('name');
    }

    get email() {
        return this.form.get('email');
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        
        this.service.userSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.data.avatar = res.url;
        });
    }

}
