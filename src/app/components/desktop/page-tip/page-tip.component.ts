import { Component, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-page-tip',
    templateUrl: './page-tip.component.html',
    styleUrls: ['./page-tip.component.scss']
})
export class PageTipComponent {

    public readonly title = input($localize `Tip`);

    public isMin = false;

    public tapMin() {
        this.isMin = !this.isMin;
    }

}
