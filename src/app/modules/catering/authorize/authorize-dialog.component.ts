import { Component, input } from '@angular/core';

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
    public visible = false;
    public readonly title = input('扫码加入');
    public image = 'assets/images/wx.jpg';

    constructor() { }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }

}
