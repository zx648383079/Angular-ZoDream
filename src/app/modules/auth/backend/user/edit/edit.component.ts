import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IRole } from '../../../../../theme/models/auth';
import { IUserZone, SexItems } from '../../../../../theme/models/user';
import { FileUploadService } from '../../../../../theme/services/file-upload.service';
import { AuthService } from '../../auth.service';
import { email, form, required, validate } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-auth-b-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditUserComponent implements OnInit {
    private readonly service = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);
    private readonly location = inject(Location);

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

    public readonly roleItems = signal<IRole[]>([]);
    public readonly zoneItems = signal<IUserZone[]>([]);
    public sexItems = SexItems;

    ngOnInit() {
        this.service.batch({
            roles: {},
            zones: {}
        }).subscribe(res => {
            this.roleItems.set(res.roles);
            this.zoneItems.set(res.zones);
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
        this.location.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
        e?.enter();
        this.service.userSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.uploadService.uploadImage(files[0]).subscribe(res => {
            this.dataForm.avatar().value.set(res.url);
        });
    }

}
