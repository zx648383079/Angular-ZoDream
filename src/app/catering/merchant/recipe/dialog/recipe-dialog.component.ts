import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../../theme/constants';

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

    constructor() { }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }

}
