import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IRole } from '../../../../../theme/models/auth';
import { IUser, IUserZone, SexItems } from '../../../../../theme/models/user';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { AuthService } from '../../auth.service';
import { confirmValidator } from '../../../../../components/desktop/directives';
import { email, form, required, validate } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditUserComponent implements OnInit {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        email: '',
        avatar: '',
        sex: 0,
        birthday: '',
        zone_id: 0,
        roles: [],
        password: '',
        confirm_password: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.email);
        email(schemaPath.email);
        validate(schemaPath.confirm_password, ({value, valueOf}) => {
            if (value() !== valueOf(schemaPath.password)) {
                return {
                    kind: 'sameOf',
                    message: '两次秘密比一致'
                }
            }
            return null;
        });
    });

    public roleItems: IRole[] = [];
    public zoneItems: IUserZone[] = [];
    public sexItems = SexItems;

    ngOnInit() {
        this.service.batch({
            roles: {},
            zones: {}
        }).subscribe(res => {
            this.roleItems = res.roles;
            this.zoneItems = res.zones;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.userDetail(params.id).subscribe(res => {
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    avatar: res.avatar,
                    sex: res.sex,
                    email: res.email,
                    birthday: res.birthday,
                    zone_id: res.zone_id,
                    roles: res.roles.map(i => {
                            return typeof i === 'string' ? parseInt(i, 10) : i;
                        }),
                    password: '',
                    confirm_password: '',
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
        const data: any = this.dataForm().value();
        this.service.userSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.dataForm.avatar().value.set(res.url);
        });
    }

}
