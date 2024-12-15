import { Component, Input, OnInit } from '@angular/core';
import { DialogAnimation } from '../../../../theme/constants';

@Component({
    standalone: false,
    selector: 'app-catering-goods-dialog',
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
