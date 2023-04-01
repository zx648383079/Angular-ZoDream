import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IErrorResponse } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { IUser } from '../../../../theme/models/user';
import { parseNumber } from '../../../../theme/utils';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

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
    public form = this.fb.group({
        name: ['', Validators.required],
        sex: [0],
        birthday: [''],
    });
    public tabIndex = 0;
    public stepData = {
        name: '',
    };

    constructor(
        private service: ShopService,
        private toastrService: DialogService,
        public route: ActivatedRoute,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.service.profile().subscribe({
            next: user => {
                this.user = user;
                this.form.patchValue({
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
        this.form.get('sex').setValue(parseNumber(item.value));
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: any = Object.assign({}, this.form.value);
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
