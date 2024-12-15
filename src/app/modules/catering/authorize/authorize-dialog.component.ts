import { Component, Input, OnInit } from '@angular/core';
import { DialogAnimation } from '../../../theme/constants';

@Component({
    standalone: false,
    selector: 'app-authorize-dialog',
    templateUrl: './authorize-dialog.component.html',
    styleUrls: ['./authorize-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class AuthorizeDialogComponent {

    /**
     * 是否显示
     */
    @Input() public visible = false;
    @Input() public title = '扫码加入';
    public image = 'assets/images/wx.jpg';

    constructor() { }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }

}
