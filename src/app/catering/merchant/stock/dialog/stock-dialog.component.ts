import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../theme/constants';

@Component({
    selector: 'app-stock-dialog',
    templateUrl: './stock-dialog.component.html',
    styleUrls: ['./stock-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class StockDialogComponent {
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
