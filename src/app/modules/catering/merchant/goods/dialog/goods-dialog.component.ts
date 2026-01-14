import { Component, signal, viewChild } from '@angular/core';
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
    public readonly visible = signal(false);
    public readonly tabIndex = signal(0);
    public readonly items = signal<ICateringRecipeMaterial[]>([]);
    public multipleEditable = false;
    public nextData: any = {
        name: '',
        unit: '',
    };

    public open() {
        this.visible.set(true);
    }

    public close(yes = false) {
        if (this.flipModal().index() > 1 && yes && !this.addLine()) {
            return;
        }
        if (this.flipModal().index() > 0) {
            this.flipModal().back();
            return;
        }
        this.visible.set(false);
    }

    public tapEditLine(item?: ICateringRecipeMaterial) {
        this.nextData = item ? item : {name: '', unit: this.nextData.unit};
        this.multipleEditable = false;
        this.flipModal().navigate(2);
    }

    public tapRemoveLine(item: ICateringRecipeMaterial) {
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
                    return [...v];
                }
            }
            v.push({...this.nextData} as any);
            return [...v];
        });
        return true;
    }

}
