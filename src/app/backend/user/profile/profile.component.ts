import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'src/app/theme/interfaces';
import { Store } from '@ngrx/store';
import { getCurrentUser } from 'src/app/theme/reducers/auth.selectors';
import { IUser } from '../../../theme/models/user';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../theme/services';
import { UserService } from '../user.service';
import { DialogBoxComponent } from '../../../theme/components';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        sex: [0],
        avatar: [''],
        birthday: [''],
    });

    public data: IUser;
    public sexItems = ['未知', '男', '女'];
    public reasonItems = [
        '需要解绑手机',
        '需要解绑邮箱',
        '安全/隐私顾虑',
        '这是多余的账户',
    ];
    public reasonSelected = 0;
    public minDate: Date;
    public maxDate: Date;

    constructor(
        private fb: FormBuilder,
        private service: UserService,
        private store: Store<AppState>,
        private toastrService: ToastrService,
        private authService: AuthService,
    ) {
        this.maxDate = new Date();
        this.minDate = new Date(this.maxDate.getFullYear() - 130, this.maxDate.getMonth(), this.maxDate.getDate());
        this.store.select(getCurrentUser).subscribe(user => {
            this.data = user;
            this.form.patchValue({
                name: user.name,
                email: user.email,
                sex: user.sex,
                avatar: user.avatar,
                birthday: user.birthday,
            });
        });
    }

    ngOnInit() {
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: any = Object.assign({}, this.form.value);
        this.service.uploadProfile(data).subscribe(_ => {
            this.toastrService.success('保存成功');
        }, err => {
            this.toastrService.warning(err.error.message);
        });
    }

    public openCancel(modal: DialogBoxComponent) {
        modal.open(() => {
            // TODO 注销
        });
    }

    public quiteUser() {
        this.toastrService.info('您即将退出此账户。。。');
        setTimeout(() => {
            this.authService.logout();
        }, 2000);
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.service.uploadAvatar(files[0]).subscribe(res => {
            this.data = res;
            this.form.get('avatar').setValue(res.avatar);
            this.toastrService.success('头像已更换');
        });
    }
}
