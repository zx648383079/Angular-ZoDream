import { Component } from '@angular/core';
import { IFriendGroup } from '../model';

@Component({
    standalone: false,
    selector: 'app-chat-select-dialog',
    templateUrl: './select-dialog.component.html',
    styleUrls: ['./select-dialog.component.scss']
})
export class SelectDialogComponent {

    public items: IFriendGroup[] = [];
    public selected = 0;
    public visible = false;

    private confirmFn: Function;


    public open(items: IFriendGroup[], value: number, cb: (res: boolean) => void) {
        this.items = items;
        this.selected = value;
        this.visible = true;
        this.confirmFn = cb;
    }

    public close(result = false) {
        this.visible = false;
        this.confirmFn(result);
    }

}
