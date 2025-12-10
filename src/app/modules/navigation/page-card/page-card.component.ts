import { Component, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-navigation-page-card',
    templateUrl: './page-card.component.html',
    styleUrls: ['./page-card.component.scss'],
})
export class PageCardComponent {

    /**
     * 是否显示
     */
     public readonly visible = input(false);

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
