import { Component, signal } from '@angular/core';

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
    public readonly visible = signal(false);

    public readonly isLoading = signal(false);

    public open() {
        this.visible.set(true);
    }

    public close() {
        this.visible.set(false);
    }

    public tapSubmit() {
        this.isLoading.set(true);
    }
}
