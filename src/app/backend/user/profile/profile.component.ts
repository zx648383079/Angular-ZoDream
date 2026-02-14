import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AppState } from '../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { IUser, SexItems } from '../../../theme/models/user';
import { AuthService } from '../../../theme/services';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { email, form, required } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-b-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    private readonly service = inject(UserService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly toastrService = inject(DialogService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);


    public readonly dataModel = signal({
        name: '',
        email: '',
        sex: 0,
        avatar: '',
        birthday: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        email(schemaPath.email);
        required(schemaPath.email);
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

    constructor() {
        this.maxDate = new Date();
        this.minDate = new Date(this.maxDate.getFullYear() - 130, this.maxDate.getMonth(), this.maxDate.getDate());
        this.store.select(selectAuthUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
            this.data = user;
            this.dataModel.set({
                name: user.name,
                email: user.email,
                sex: user.sex,
                avatar: user.avatar,
                birthday: user.birthday,
            });
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        e?.enter();
        const data: any = this.dataForm().value();
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

    public openCancel(modal: DialogEvent) {
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
            this.dataForm.avatar().value.set(res.avatar);
            this.toastrService.success('头像已更换');
        });
    }
}
