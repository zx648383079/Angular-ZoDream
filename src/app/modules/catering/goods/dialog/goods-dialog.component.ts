import { Component, signal } from '@angular/core';

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
    public readonly visible = signal(false);

    public open() {
        this.visible.set(true);
    }

    public close() {
        this.visible.set(false);
    }
}
