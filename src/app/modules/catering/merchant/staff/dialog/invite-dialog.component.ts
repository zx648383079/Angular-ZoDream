import { Component, Input, OnInit } from '@angular/core';
import { DialogAnimation } from '../../../../../theme/constants';

@Component({
    selector: 'app-catering-invite-dialog',
    templateUrl: './invite-dialog.component.html',
    styleUrls: ['./invite-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class InviteDialogComponent {

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
