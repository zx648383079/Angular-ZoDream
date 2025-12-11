import { Component, viewChild } from '@angular/core';
import { FlipContainerComponent } from '../../../../../components/swiper';
import { ICateringRecipeMaterial } from '../../../model';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-goods-dialog',
    templateUrl: './goods-dialog.component.html',
    styleUrls: ['./goods-dialog.component.scss'],
})
export class GoodsDialogComponent {

    public readonly flipModal = viewChild(FlipContainerComponent);

    /**
     * 是否显示
     */
    public visible = false;
    public tabIndex = 0;
    public items: ICateringRecipeMaterial[] = [];
    public multipleEditable = false;
    public nextData: any = {
        name: '',
        unit: '',
    };

    public open() {
        this.visible = true;
    }

    public close(yes = false) {
        if (this.flipModal().index() > 1 && yes && !this.addLine()) {
            return;
        }
        if (this.flipModal().index() > 0) {
            this.flipModal().back();
            return;
        }
        this.visible = false;
    }

    public tapEditLine(item?: ICateringRecipeMaterial) {
        this.nextData = item ? item : {name: '', unit: this.nextData.unit};
        this.multipleEditable = false;
        this.flipModal().navigate(2);
    }

    public tapRemoveLine(item: ICateringRecipeMaterial) {
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
