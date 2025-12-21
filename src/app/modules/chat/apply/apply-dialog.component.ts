import { Component, inject, signal } from '@angular/core';
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


    public readonly items = signal<IApplyLog[]>([]);
    public readonly visible = signal(false);
    private confirmFn: Function;

    public open(cb: () => void) {
        this.visible.set(true);
        this.confirmFn = cb;
        this.service.applies({}).subscribe(res => {
            this.items.set(res.data);
        });
    }

    public close() {
        this.visible.set(false);
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
