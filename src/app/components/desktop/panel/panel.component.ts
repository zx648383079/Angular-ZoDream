import { Component, effect, input, signal, untracked } from '@angular/core';

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
    public readonly isOpen = signal(true);

    constructor() {
        effect(() => {
            const val = this.min();
            untracked(() => {
                this.isOpen.set(!val);
            });
        });
    }

    public tapToggle() {
        this.isOpen.update(v => !v);
    }

}
