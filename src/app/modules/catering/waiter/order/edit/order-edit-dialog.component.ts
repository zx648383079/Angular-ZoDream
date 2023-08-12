import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../../theme/constants';
import { emptyValidate } from '../../../../../theme/validators';
import { ICateringOrder, ICateringOrderGoods } from '../../../model';

@Component({
    selector: 'app-catering-order-edit-dialog',
    templateUrl: './order-edit-dialog.component.html',
    styleUrls: ['./order-edit-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class OrderEditDialogComponent {

    /**
     * 是否显示
     */
     @Input() public visible = false;
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
