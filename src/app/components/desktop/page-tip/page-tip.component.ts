import { Component, input, signal } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-page-tip',
    templateUrl: './page-tip.component.html',
    styleUrls: ['./page-tip.component.scss']
})
export class PageTipComponent {

    public readonly title = input($localize `Tip`);

    public readonly isMin = signal(false);

    public tapMin() {
        this.isMin.update(v => !v);
    }

}
