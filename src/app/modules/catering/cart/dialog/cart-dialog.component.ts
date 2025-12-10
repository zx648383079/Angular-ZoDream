import { Component, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-catering-cart-dialog',
    templateUrl: './cart-dialog.component.html',
    styleUrls: ['./cart-dialog.component.scss'],
})
export class CartDialogComponent {

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
