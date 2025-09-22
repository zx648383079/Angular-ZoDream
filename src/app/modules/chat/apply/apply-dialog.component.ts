import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
    standalone: false,
    selector: 'app-chat-apply-dialog',
    templateUrl: './apply-dialog.component.html',
    styleUrls: ['./apply-dialog.component.scss']
})
export class ApplyDialogComponent {

    public visible = false;

    private confirmFn: Function;

    constructor(
        private service: ChatService
    ) {
    }

    public open(cb: () => void) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public close() {
        this.visible = false;
    }
}
