import { Component, OnInit, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-chat-rename-dialog',
    templateUrl: './rename-dialog.component.html',
    styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent {


    public readonly value = signal('');
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
