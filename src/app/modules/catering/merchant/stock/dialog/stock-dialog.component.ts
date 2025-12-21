import { Component, input, signal, viewChild } from '@angular/core';
import { ICateringPurchaseOrder, ICateringPurchaseOrderGoods } from '../../../model';
import { emptyValidate } from '../../../../../theme/validators';
import { FlipContainerComponent } from '../../../../../components/swiper';

@Component({
    standalone: false,
    selector: 'app-stock-dialog',
    templateUrl: './stock-dialog.component.html',
    styleUrls: ['./stock-dialog.component.scss'],
})
export class StockDialogComponent {
    public readonly flipModal = viewChild(FlipContainerComponent);
    /**
     * 是否显示
     */
     public readonly visible = signal(false);
     public data: ICateringPurchaseOrder = {} as any;
     public readonly items = signal<ICateringPurchaseOrderGoods[]>([]);
     public multipleEditable = false;
     public nextData: any = {
        name: '',
        unit: '',
     };
     
    public open() {
        this.visible.set(true);
    }

    public close(yes = false) {
        if (this.flipModal().index() > 0) {
            if (yes && !this.addLine()) {
                return;
            }
            this.flipModal().back();
            return;
        }
        this.visible.set(false);
    }

    public tapEditLine(item?: ICateringPurchaseOrderGoods) {
        this.nextData = item ? item : {name: '', unit: this.nextData.unit};
        this.multipleEditable = false;
        this.flipModal().navigate(1);
    }

    public tapRemoveLine(item: ICateringPurchaseOrderGoods) {
        this.items.update(v => {
            return v.filter(i => i !== item);
        });
    }

    private addLine(): boolean {
        if (emptyValidate(this.nextData.name)) {
            return false;
        }
        this.items.update(v => {
            for (const item of v) {
                if (item.name === this.nextData.name) {
                    item.unit = this.nextData.unit;
                    return v;
                }
            }
            v.push({...this.nextData} as any);
            return v;
        });
        return true;
    }

}
