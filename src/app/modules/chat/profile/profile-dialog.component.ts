import { Component, signal } from '@angular/core';
import { IUser } from '../../../theme/models/user';

@Component({
    standalone: false,
    selector: 'app-chat-profile-dialog',
    templateUrl: './profile-dialog.component.html',
    styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent {

    public data: IUser = null;
    public readonly remark = signal('');
    public mode = 0;
    public visible = false;

    private confirmFn: Function;


    public open(user: IUser, cb: (res: boolean) => void) {
        this.data = user;
        this.visible = true;
        this.remark.set('');
        this.confirmFn = cb;
    }

    public close(result = false) {
        this.visible = false;
        this.confirmFn(result);
    }
}
