import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../theme/constants';

@Component({
    selector: 'app-custom-dialog',
    templateUrl: './custom-dialog.component.html',
    styleUrls: ['./custom-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class CustomDialogComponent {

    /**
     * 是否显示
     */
    @Input() public visible = false;
    @Input() public title = '名称';

    constructor() { }

    public open(title?: string) {
        if (title) {
            this.title = title;
        }
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }
}
