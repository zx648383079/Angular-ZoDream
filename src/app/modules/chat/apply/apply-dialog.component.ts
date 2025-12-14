import { Component, inject } from '@angular/core';
import { ChatService } from '../chat.service';
import { IApplyLog } from '../model';

@Component({
    standalone: false,
    selector: 'app-chat-apply-dialog',
    templateUrl: './apply-dialog.component.html',
    styleUrls: ['./apply-dialog.component.scss']
})
export class ApplyDialogComponent {
    private readonly service = inject(ChatService);


    public items: IApplyLog[] = [];
    public visible = false;
    private confirmFn: Function;

    public open(cb: () => void) {
        this.visible = true;
        this.confirmFn = cb;
        this.service.applies({}).subscribe(res => {
            this.items = res.data;
        });
    }

    public close() {
        this.visible = false;
        this.confirmFn();
    }

    public tapReject(item: IApplyLog) {
        item.status = 2;
    }

    public tapAccept(item: IApplyLog) {
        this.service.applyAccept({
            user: item.user.id
        }).subscribe(_ => item.status = 1);
    }
}
