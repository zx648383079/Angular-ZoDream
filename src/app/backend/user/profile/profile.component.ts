import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppState } from '../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { IUser, SexItems } from '../../../theme/models/user';
import { AuthService } from '../../../theme/services';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

    public form = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        sex: [0],
        avatar: [''],
        birthday: [''],
    });

    public data: IUser;
    public sexItems = SexItems;
    public reasonItems = [
        '需要解绑手机',
        '需要解绑邮箱',
        '安全/隐私顾虑',
        '这是多余的账户',
    ];
    public reasonSelected = 0;
    public minDate: Date;
    public maxDate: Date;
    private subItems = new Subscription();

    constructor(
        private fb: FormBuilder,
        private service: UserService,
        private store: Store<AppState>,
        private toastrService: DialogService,
        private authService: AuthService,
        private router: Router,
    ) {
        this.maxDate = new Date();
        this.minDate = new Date(this.maxDate.getFullYear() - 130, this.maxDate.getMonth(), this.maxDate.getDate());
        this.subItems.add(this.store.select(selectAuthUser).subscribe(user => {
            this.data = user;
            this.form.patchValue({
                name: user.name,
                email: user.email,
                sex: user.sex,
                avatar: user.avatar,
                birthday: user.birthday,
            });
        }));
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        e?.enter();
        const data: any = Object.assign({}, this.form.value);
        this.service.uploadProfile(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
            }, error: err => {
                e?.reset();
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public openCancel(modal: DialogBoxComponent) {
        modal.open(() => {
            // TODO 注销
        });
    }

    public quiteUser() {
        this.toastrService.tip('您即将退出此账户。。。');
        setTimeout(() => {
            this.authService.logout().subscribe(_ => {
                this.router.navigate(['/auth']);
            });
        }, 1000);
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
