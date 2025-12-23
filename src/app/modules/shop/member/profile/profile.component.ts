import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IErrorResponse } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { IUser } from '../../../../theme/models/user';
import { parseNumber } from '../../../../theme/utils';
import { ShopService } from '../../shop.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly toastrService = inject(DialogService);
    route = inject(ActivatedRoute);


    public sexItems: IItem[] = [
        {
            name: '未知',
            value: 0,
        },
        {
            name: '男',
            value: 1,
        },
        {
            name: '女',
            value: 2,
        },
    ];

    public user: IUser;
    public readonly dataModel = signal({
        name: '',
        sex: 0,
        birthday: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });
    public tabIndex = 0;
    public stepData = {
        name: '',
    };

    ngOnInit() {
        this.service.profile().subscribe({
            next: user => {
                this.user = user;
                this.dataModel.set({
                    name: user.name,
                    sex: user.sex,
                    birthday: user.birthday,
                });
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    public tapStepEdit(name = 'email') {
        this.tabIndex = 2;
        this.stepData.name = name;
    }


    public tapSex(item: IItem) {
        this.user.sex = item.value as number;
        this.user.sex_label = item.name;
        this.dataForm.sex().value.set(parseNumber(item.value));
    }

    public tapSubmit(e: Event) {
        e.preventDefault();
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
        this.service.updateProfile(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Save Successfully`);
            }, error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.service.uploadAvatar(files[0]).subscribe(res => {
            this.user = res;
            this.toastrService.success('头像已更换');
        });
    }
}
