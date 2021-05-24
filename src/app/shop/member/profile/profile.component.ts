import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../dialog';
import { IErrorResponse } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { IUser } from '../../../theme/models/user';
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
        email: ['', [Validators.email, Validators.required]],
        mobile: [''],
        sex: [0],
        birthday: [''],
      });

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
                    email: user.email,
                    mobile: '',
                    sex: user.sex,
                    birthday: user.birthday,
                });
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }


    public tapSex(item: IItem) {
        this.user.sex = item.value as number;
        this.user.sex_label = item.name;
        this.form.get('sex').setValue(item.value);
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        this.service.uploadProfile(data).subscribe({
            next: _ => {
                this.toastrService.success('保存成功');
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
