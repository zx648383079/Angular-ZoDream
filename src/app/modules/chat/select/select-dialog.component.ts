import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-chat-select-dialog',
    templateUrl: './select-dialog.component.html',
    styleUrls: ['./select-dialog.component.scss']
})
export class SelectDialogComponent {

    public items: any[] = [];
    public selected: any;
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
