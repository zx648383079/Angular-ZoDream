import { Component, input, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-catering-invite-dialog',
    templateUrl: './invite-dialog.component.html',
    styleUrls: ['./invite-dialog.component.scss'],
})
export class InviteDialogComponent {

    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    public readonly title = input('扫码加入');
    public image = 'assets/images/wx.jpg';

    constructor() { }

    public open() {
        this.visible.set(true);
    }

    public close() {
        this.visible.set(false);
    }

}
