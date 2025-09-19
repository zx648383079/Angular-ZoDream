import { Component, Input } from '@angular/core';
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
     @Input() public visible = false;
     private onLogin: (user: IUser) => void;

    constructor() { }

    public open(cb?: (user: IUser) => void) {
        this.visible = true;
        this.onLogin = cb;
    }

    public close(user?: IUser) {
        this.visible = false;
        if (user && this.onLogin) {
            this.onLogin(user);
        }
    }
}
