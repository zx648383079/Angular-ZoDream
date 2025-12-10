import { Component, OnInit, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-catering-goods-dialog',
    templateUrl: './goods-dialog.component.html',
    styleUrls: ['./goods-dialog.component.scss'],
})
export class GoodsDialogComponent {

    /**
     * 是否显示
     */
     public readonly visible = input(false);

    constructor() { }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }
}
