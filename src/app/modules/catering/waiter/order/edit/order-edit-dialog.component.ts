import { Component, input } from '@angular/core';
import { ICateringOrder, ICateringOrderGoods } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-catering-order-edit-dialog',
    templateUrl: './order-edit-dialog.component.html',
    styleUrls: ['./order-edit-dialog.component.scss'],
})
export class OrderEditDialogComponent {

    /**
     * 是否显示
     */
     public readonly visible = input(false);
     public data: ICateringOrder = {} as any;
     public items: ICateringOrderGoods[] = [];
     public multipleEditable = false;
     public nextData: any = {
        name: '',
        unit: '',
     };
     
    public open() {
        this.visible = true;
    }

    public close(yes = false) {
        this.visible = false;
    }

}
