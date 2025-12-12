import { Component, effect, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent {

    public readonly title = input($localize `Tip`);
    public readonly theme = input('');
    public readonly min = input(false);
    public isOpen = true;

    constructor() {
        effect(() => {
            this.isOpen = !this.min();
        });
    }

    public tapToggle() {
        this.isOpen = !this.isOpen;
    }

}
