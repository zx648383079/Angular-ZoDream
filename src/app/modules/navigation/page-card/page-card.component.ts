import { Component, Input, OnInit } from '@angular/core';
import { DialogAnimation } from '../../../theme/constants';

@Component({
    selector: 'app-page-card',
    templateUrl: './page-card.component.html',
    styleUrls: ['./page-card.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class PageCardComponent {

    /**
     * 是否显示
     */
     @Input() public visible = false;

     public isLoading = false;

    constructor() { }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }

    public tapSubmit() {
        this.isLoading = true;
    }
}
