import { Component, input, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-authorize-dialog',
    templateUrl: './authorize-dialog.component.html',
    styleUrls: ['./authorize-dialog.component.scss'],
})
export class AuthorizeDialogComponent {

    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    public readonly title = input('扫码加入');
    public image = 'assets/images/wx.jpg';

    public open() {
        this.visible.set(true);
    }

    public close() {
        this.visible.set(false);
    }

}
