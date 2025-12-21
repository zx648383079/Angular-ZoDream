import { Component, OnInit, ViewChild, input, signal } from '@angular/core';
import { ICateringOrder, ICateringOrderGoods } from '../../../model';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-catering-order-create-dialog',
    templateUrl: './order-create-dialog.component.html',
    styleUrls: ['./order-create-dialog.component.scss'],
})
export class OrderCreateDialogComponent {
    /**
     * 是否显示
     */
     public readonly visible = signal(false);
     public flipIndex = 0;
     public data: ICateringOrder = {} as any;
     public readonly items = signal<ICateringOrderGoods[]>([]);
     public multipleEditable = false;
     public nextData: any = {
        name: '',
        unit: '',
     };
     
    public open() {
        this.visible.set(true);
    }

    public close(yes = false) {
        if (this.flipIndex > 0) {
            if (yes && !this.addLine()) {
                return;
            }
            this.flipIndex --;
            return;
        }
        this.visible.set(false);
    }

    public tapEditLine(item?: ICateringOrderGoods) {
        this.nextData = item ? item : {name: '', unit: this.nextData.unit};
        this.multipleEditable = false;
        this.flipIndex = 1;
    }

    public tapRemoveLine(item: ICateringOrderGoods) {
        this.items.set(this.items().filter(i => i !== item));
    }

    private addLine(): boolean {
        if (emptyValidate(this.nextData.name)) {
            return false;
        }
        for (const item of this.items()) {
            if (item.name === this.nextData.name) {
                return true;
            }
        }
        this.items.update(v => {
            v.push({...this.nextData} as any);
            return v;
        });
        return true;
    }

}
