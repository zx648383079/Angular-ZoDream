import { Component, Input, ViewChild } from '@angular/core';
import { DialogAnimation } from '../../../../../theme/constants';
import { ICateringPurchaseOrder, ICateringPurchaseOrderGoods } from '../../../model';
import { emptyValidate } from '../../../../../theme/validators';
import { FlipContainerComponent } from '../../../../../components/swiper';

@Component({
    selector: 'app-stock-dialog',
    templateUrl: './stock-dialog.component.html',
    styleUrls: ['./stock-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class StockDialogComponent {
    @ViewChild(FlipContainerComponent)
    public flipModal: FlipContainerComponent;
    /**
     * 是否显示
     */
     @Input() public visible = false;
     public data: ICateringPurchaseOrder = {} as any;
     public items: ICateringPurchaseOrderGoods[] = [];
     public multipleEditable = false;
     public nextData: any = {
        name: '',
        unit: '',
     };
     
    public open() {
        this.visible = true;
    }

    public close(yes = false) {
        if (this.flipModal.index > 0) {
            if (yes && !this.addLine()) {
                return;
            }
            this.flipModal.back();
            return;
        }
        this.visible = false;
    }

    public tapEditLine(item?: ICateringPurchaseOrderGoods) {
        this.nextData = item ? item : {name: '', unit: this.nextData.unit};
        this.multipleEditable = false;
        this.flipModal.navigate(1);
    }

    public tapRemoveLine(item: ICateringPurchaseOrderGoods) {
        this.items = this.items.filter(i => i !== item);
    }

    private addLine(): boolean {
        if (emptyValidate(this.nextData.name)) {
            return false;
        }
        for (const item of this.items) {
            if (item.name === this.nextData.name) {
                item.unit = this.nextData.unit;
                return true;
            }
        }
        this.items.push({...this.nextData} as any);
        return true;
    }

}
