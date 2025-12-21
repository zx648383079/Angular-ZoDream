import { Component, signal } from '@angular/core';
import { IFriendGroup } from '../model';

@Component({
    standalone: false,
    selector: 'app-chat-select-dialog',
    templateUrl: './select-dialog.component.html',
    styleUrls: ['./select-dialog.component.scss']
})
export class SelectDialogComponent {

    public readonly items = signal<IFriendGroup[]>([]);
    public selected = 0;
    public readonly visible = signal(false);

    private confirmFn: Function;


    public open(items: IFriendGroup[], value: number, cb: (res: boolean) => void) {
        this.items.set(items);
        this.selected = value;
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public close(result = false) {
        this.visible.set(false);
        this.confirmFn(result);
    }

}
