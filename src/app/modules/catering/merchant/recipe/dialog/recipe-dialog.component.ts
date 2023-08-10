import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../../theme/constants';
import { ICateringRecipe, ICateringRecipeMaterial } from '../../../model';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    selector: 'app-recipe-dialog',
    templateUrl: './recipe-dialog.component.html',
    styleUrls: ['./recipe-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class RecipeDialogComponent {

    /**
     * 是否显示
     */
     @Input() public visible = false;
     public data: ICateringRecipe = {} as any;
     public items: ICateringRecipeMaterial[] = [];
     public flipIndex = 0;
     public multipleEditable = false;
     public nextData: any = {
        name: '',
        unit: '',
     };
     
    public get flipStyle() {
        return {
            transform: 'translateX(-' + this.flipIndex * 30 + 'rem)'
        };
    }

    public open() {
        this.visible = true;
    }

    public close(yes = false) {
        if (this.flipIndex > 0) {
            if (yes && !this.addLine()) {
                return;
            }
            this.flipIndex = 0
            return;
        }
        this.visible = false;
    }

    public tapEditLine(item?: ICateringRecipeMaterial) {
        this.nextData = item ? item : {name: '', unit: this.nextData.unit};
        this.multipleEditable = false;
        this.flipIndex = 1;
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
