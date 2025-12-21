import { Component, signal } from '@angular/core';
import { IUser } from '../../../../theme/models/user';

@Component({
    standalone: false,
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent {

    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    private confirmFn: (user: IUser) => void;

    public open(cb?: (user: IUser) => void) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public close(user?: IUser) {
        this.visible.set(false);
        if (user && this.confirmFn) {
            this.confirmFn(user);
        }
    }
}
