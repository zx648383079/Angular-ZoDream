import { Component, signal } from '@angular/core';

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
     public readonly visible = signal(false);

    public open() {
        this.visible.set(true);
    }

    public close() {
        this.visible.set(false);
    }

}
