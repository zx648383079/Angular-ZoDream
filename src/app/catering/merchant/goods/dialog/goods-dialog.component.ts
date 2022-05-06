import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../theme/constants';

@Component({
    selector: 'app-goods-dialog',
    templateUrl: './goods-dialog.component.html',
    styleUrls: ['./goods-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class GoodsDialogComponent {

    /**
     * 是否显示
     */
    @Input() public visible = false;

    constructor() { }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }

}
