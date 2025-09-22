import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-chat-profile-dialog',
    templateUrl: './profile-dialog.component.html',
    styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent {

    public data: any;
    public remark = '';
    public editable = false;
    public visible = false;

    private confirmFn: Function;


    public open(cb: () => void) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public close() {
        this.visible = false;
    }
}
